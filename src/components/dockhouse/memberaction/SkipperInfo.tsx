import * as React from 'react';
import person from 'assets/img/icons/person.svg';
import { AddEditCrewProps, MemberActionProps, MemberActionState, SignoutActionMode } from "./MemberActionState";
import { getProgramHR } from 'util/textAdapter';
import { ScannedPersonType } from 'async/staff/dockhouse/scan-card';

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

function getCrewActions(props: {state: MemberActionState, setState: React.Dispatch<React.SetStateAction<MemberActionState>>, mode: SignoutActionMode}){
    return {
        add: (newCrew) => {
            props.setState((s) => ({...s, currentPeople: s.currentPeople.concat(newCrew)}));
        },
        remove: (index) => {
            props.setState((s) => ({...s, currentPeople: s.currentPeople.filter((a, i) => i != index)}));
        },
        setSkipper: (index) => {
            props.setState((s) => ({...s, currentPeople: s.currentPeople.map((a, i) => ({...a, isSkipper: (index == i)}))}));
        },
        setTesting: (index, testing) => {
            props.setState((s) => ({...s, currentPeople: s.currentPeople.map((a, i) => (index == i) ? ({...a, isTesting: testing}) : a)}));
        }
    }
}

function isHold(crew: ScannedPersonType){
    return false;
}

export function CrewIcons(props: {skipper: ScannedPersonType}){
    return <div className="flex flex-row">
            {props.skipper.bannerComment.isSome() ? <img src={hold} width={50}/> : <></>}
            {isHold(props.skipper) ? <img src={comments} width={50}/> : <></>}
        </div>;
}

export function DetailedPersonInfo(props: MemberActionProps & {index: number}) {
    const crewActions = getCrewActions(props);
    const currentPerson = props.state.currentPeople[props.index];
    if(!currentPerson.isSkipper && props.mode != SignoutActionMode.TESTING)
        return <></>;
    if(!currentPerson.isTesting && props.mode == SignoutActionMode.TESTING)
        return <></>;
    const currentMembership = findCurrentMembership(currentPerson);
    const programHR = getProgramHR(currentMembership.programId.getOrElse(-1));
    return <div key={currentPerson.personId} className="flex flex-row grow-0 gap-5">
        <div className="flex flex-col">
            <h3 className="font-bold inline-block">{props.mode == SignoutActionMode.TESTING ? "Testing:" : "Skipper:"}</h3>
            <CrewIcons skipper={currentPerson} />
            <h3 className="text-2xl font-bold">{currentPerson.nameFirst} {currentPerson.nameLast}</h3>
            <h3 className="text-xl">{programHR}</h3>
            <h3 className="text-xl">{currentMembership.membershipTypeId} TODO make this HR</h3>
            <h3 className="text-xl">{currentMembership.expirationDate.isSome() ? currentMembership.expirationDate.value.format() : "Never"}</h3>
            <h3 className="text-xl">Guest Privileges: {currentMembership.hasGuestPrivs ? "Yes" : "No"}</h3>
        </div>
        <div className="flex flex-col">
        {props.mode == SignoutActionMode.TESTING ? <div className="flex flex-row mr-0 ml-auto"><h3>Testing:</h3><IconButton src={minus} onClick={(e) => {e.preventDefault(); crewActions.setTesting(props.index, false)}}/></div> : <></>}
            <img src={person} className="mt-auto mb-0 border-r pr-5 border-black"></img>
        </div>
    </div>;
}

export function AddEditCrew(props: MemberActionProps){
    const crewActions = getCrewActions(props);
    return (
        <div className="flex flex-col">
            <h3 className="font-bold">Crew:</h3>
            <div className="flex flex-row gap-5">
                <AddCrew {...props} {...crewActions}></AddCrew>
                <EditCrew {...props} {...crewActions}></EditCrew>
            </div>
        </div>);
}

export function AddCrew(props: AddEditCrewProps){
    const setRandom = (e) => {
        //props.setState((state) => ({...state, currentPeople: state.currentPeople.map((a) => )}));
    }
    const isSignout = (props.mode == SignoutActionMode.SIGNOUT || props.mode == SignoutActionMode.RACING);
    return (<div className="flex flex-col grow-0 gap-2">
            {isSignout ? <div className="flex flex-row gap-2">
                <Button className="bg-gray-200">Search Phone</Button>
                <Button className="bg-gray-200">Search Name</Button>
            </div> : <></>}
            <CardNumberScanner label="Add person..." onAction={(a) => {
                props.add({...a, isSkipper: false, isTesting: false, testRatingId: option.none, sortOrder: 0});
            }}></CardNumberScanner>
            {isSignout ? <><Button className="bg-gray-200" onClick={setRandom}>Find Highest Ratings</Button>
            <Button className="bg-gray-200" onClick={setRandom}>Find Highest Privileges</Button></> : <></>}
        </div>);
}

function EditCrewButton(props: {src: string, onClick: (e) => void, mode: SignoutActionMode}){
    const showButton = props.mode != SignoutActionMode.RATINGS && props.mode != SignoutActionMode.COMMENTS;
    return <>{showButton ? <IconButton src={props.src} className="h-[24px]" onClick={props.onClick}/> : <></>}</>;
}

export function EditCrew(props: AddEditCrewProps){
    const iconTwo = props.mode == SignoutActionMode.TESTING ? add : swap;
    const crew = <>{props.state.currentPeople.map((a, i) => {
        switch(props.mode){
            case SignoutActionMode.TESTING:
                if(a.isTesting) return undefined;
                break;
            case SignoutActionMode.SIGNOUT:
            case SignoutActionMode.RACING:
                if(a.isSkipper) return undefined;
                break;
        }
        return (<div key={i} className="whitespace-nowrap">        
            <div className="flex flex-row">
                <EditCrewButton src={x} onClick={() => {props.remove(i)}} mode={props.mode}/>
                <h3 className="font-medium">{a.nameFirst} {a.nameLast}</h3>
            </div>
            <div className="flex flex-row">
                <EditCrewButton src={iconTwo} onClick={() => {props.mode == SignoutActionMode.TESTING ? props.setTesting(i, true) : props.setSkipper(i)}} mode={props.mode}/>
                <h3 className="font-light">{getProgramHR(a.activeMemberships[0].programId.getOrElse(undefined))}</h3>
            </div>
        </div>)})}</>;
    return (<div className={"grid grow-[1] gap-5 " + ((props.mode != SignoutActionMode.TESTING) ? "grid-cols-4 grid-rows-2" : "grid-cols-2 grid-rows-2")}>{crew}</div>)
}
