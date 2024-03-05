import * as React from 'react';
import person from 'assets/img/icons/person.svg';
import { SignoutCombinedType, CurrentPeopleType } from "./signouts/SignoutCombinedType";
import { getProgramHR } from 'util/textAdapter';
import { ScannedPersonType } from 'models/typerefs';

import hold from 'assets/img/icons/hold.svg';
import comments from 'assets/img/icons/comments.svg';
import swap from 'assets/img/icons/buttons/swap.svg';
import x from 'assets/img/icons/buttons/x.svg';
import add from 'assets/img/icons/buttons/add.svg';
import minus from 'assets/img/icons/buttons/minus.svg';
import { Button } from 'reactstrap';
import { CardNumberScanner, findCurrentMembership } from './CardNumberScanner';
import IconButton from 'components/wrapped/IconButton';
import { option } from 'fp-ts';
import { Popover } from 'components/wrapped/Popover';
import { ActionActionType } from 'components/ActionBasedEditor';
import { AddPersonAction, RemovePersonByIdAction, SetSkipperAction, UpdatePersonByIdAction } from './member-action/Actions';
import { AddEditCrewProps, MemberActionMode } from './member-action/MemberActionType';
import { SelectInput } from 'components/wrapped/Input';
import { RatingsContext } from 'async/providers/RatingsProvider';

export function getCrewActions(props: {current: SignoutCombinedType, actions: ActionActionType<SignoutCombinedType>, mode: MemberActionMode}){
    return {
        add: (newCrew: CurrentPeopleType[number]) => {
            props.actions.addAction(new AddPersonAction(newCrew))
        },
        remove: (personId: number) => {
            props.actions.addAction(new RemovePersonByIdAction(personId))
        },
        setSkipper: (personId: number) => {
            props.actions.addAction(new SetSkipperAction(personId))
        },
        setTesting: (personId: number, testing: boolean) => {
            props.actions.addAction(new UpdatePersonByIdAction(personId, {isTesting: testing}));
        }
    }
}

function isHold(crew: ScannedPersonType){
    return false;
}

export function CrewIcons(props: {skipper: ScannedPersonType}){
    return <div className="flex flex-row">
            {props.skipper.bannerComment.isSome() ? <Popover hoverProps={{}} openDisplay={<img src={comments} width={50}/>} makeChildren={(a) => <p>{props.skipper.bannerComment.getOrElse(undefined)}</p>}/>: <></>}
            {isHold(props.skipper) ? <Popover hoverProps={undefined} openDisplay={<img src={hold} width={50}/>} makeChildren={(a) => <p>Yolo</p>}/> : <></>}
        </div>;
}

export function DetailedPersonInfo(props: {currentPerson: SignoutCombinedType['currentPeople'][number], mode: MemberActionMode, setTesting: (testing: boolean) => void, setTestRatingId: (testRatingId: option.Option<number>) => void}) {
    const currentPerson = props.currentPerson;
    const ratings = React.useContext(RatingsContext);
    if(!currentPerson.isSkipper && props.mode != MemberActionMode.TESTING)
        return <></>;
    if(!currentPerson.isTesting && props.mode == MemberActionMode.TESTING)
        return <></>;
    const currentMembership = findCurrentMembership(currentPerson);
    const programHR = getProgramHR(currentMembership.programId);
    return <div key={currentPerson.personId} className="flex flex-row grow-0 gap-5">
        <div className="flex flex-col">
            <h3 className="font-bold inline-block">{props.mode == MemberActionMode.TESTING ? "Testing:" : "Skipper:"}</h3>
            {props.mode == MemberActionMode.TESTING ? <SelectInput controlledValue={currentPerson.testRatingId} updateValue={(v) => {
                props.setTestRatingId(v);
            }} selectOptions={ratings.map((a) => ({value: a.ratingId, display: a.ratingName}))}/> : <></>}
            <CrewIcons skipper={currentPerson} />
            <h3 className="text-2xl font-bold">{currentPerson.nameFirst.getOrElse("")} {currentPerson.nameLast.getOrElse("")}</h3>
            <h3 className="text-xl">{programHR}</h3>
            <h3 className="text-xl">{currentMembership.membershipTypeId} TODO make this HR</h3>
            <h3 className="text-xl">{currentMembership.expirationDate.isSome() ? currentMembership.expirationDate.value.format() : "Never"}</h3>
            <h3 className="text-xl">Guest Privileges: {currentMembership.hasGuestPrivs ? "Yes" : "No"}</h3>
        </div>
        <div className="flex flex-col">
        {props.mode == MemberActionMode.TESTING ? <div className="flex flex-row mr-0 ml-auto"><h3>Testing:</h3><IconButton src={minus} onClick={(e) => {e.preventDefault(); props.setTesting(false)}}/></div> : <></>}
            <img src={person} className="mt-auto mb-0 border-r pr-5 border-black"></img>
        </div>
    </div>;
}

export function AddEditCrew(props: AddEditCrewProps){
    return (
        <div className="flex flex-col">
            <h3 className="font-bold">Crew:</h3>
            <div className="flex flex-row gap-5">
                <AddCrew {...props}/>
                <EditCrew {...props}/>
            </div>
        </div>);
}

export function AddCrew(props: AddEditCrewProps){
    const setRandom = (e) => {
        //props.setState((state) => ({...state, currentPeople: state.currentPeople.map((a) => )}));
    }
    const isSignout = false;//(props.mode == MemberActionMode.SIGNOUT || props.mode == MemberActionMode.RACING);
    return (<div className="flex flex-col grow-0 gap-2">
            {isSignout ? <div className="flex flex-row gap-2">
                <Button tabIndex={-1} className="bg-gray-200">Search Phone</Button>
                <Button tabIndex={-1} className="bg-gray-200">Search Name</Button>
            </div> : <></>}
            <CardNumberScanner label="Add person..." tabIndex={2} autoFocus onAction={(a) => {
                props.add({...a, isSkipper: false, isTesting: false, testRatingId: option.none});
            }}></CardNumberScanner>
            {isSignout ? <><Button className="bg-gray-200" tabIndex={-1} onClick={setRandom}>Find Highest Ratings</Button>
            <Button className="bg-gray-200" tabIndex={-1} onClick={setRandom}>Find Highest Privileges</Button></> : <></>}
        </div>);
}

function EditCrewButton(props: {src: string, onClick: (e) => void, mode: MemberActionMode}){
    const showButton = props.mode != MemberActionMode.RATINGS && props.mode != MemberActionMode.COMMENTS;
    return <>{showButton ? <IconButton src={props.src} className="h-[24px]" onClick={props.onClick}/> : <></>}</>;
}

export function EditCrew(props: AddEditCrewProps){
    const iconTwo = props.mode == MemberActionMode.TESTING ? add : swap;
    const crew = <>{props.currentPeople.map((a) => {
        switch(props.mode){
            case MemberActionMode.TESTING:
                if(a.isTesting) return undefined;
                break;
            case MemberActionMode.SIGNOUT:
            case MemberActionMode.RACING:
                if(a.isSkipper) return undefined;
                break;
        }
        return (<div key={a.personId} className="whitespace-nowrap">        
            <div className="flex flex-row">
                <EditCrewButton src={x} onClick={() => {props.remove(a.personId)}} mode={props.mode}/>
                <h3 className="font-medium">{a.nameFirst.getOrElse("")} {a.nameLast.getOrElse("")}</h3>
            </div>
            <div className="flex flex-row">
                <EditCrewButton src={iconTwo} onClick={() => {props.mode == MemberActionMode.TESTING ? props.setTesting(a.personId, true) : props.setSkipper(a.personId)}} mode={props.mode}/>
                <h3 className="font-light">{getProgramHR(a.activeMemberships[0].programId)}</h3>
            </div>
        </div>)})}</>;
    return (<div className={"grid grow-[1] gap-5 " + ((props.mode != MemberActionMode.TESTING) ? "grid-cols-4 grid-rows-2" : "grid-cols-2 grid-rows-2")}>{crew}</div>)
}
