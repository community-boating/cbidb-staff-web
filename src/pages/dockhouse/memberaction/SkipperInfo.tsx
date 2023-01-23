import * as React from 'react';
import person from 'assets/img/icons/person.svg';
import { ScannedPersonsCacheContext } from './ScannedPersonsCache';
import { MemberActionProps, MemberActionState, SignoutActionMode } from "./MemberActionState";
import { getProgramHR } from 'util/textAdapter';
import { ScannedCrewType, ScannedPersonsType } from 'async/staff/dockhouse/scan-card';

import hold from 'assets/img/icons/hold.svg';
import comments from 'assets/img/icons/comments.svg';
import swap from 'assets/img/icons/buttons/swap.svg';
import x from 'assets/img/icons/buttons/x.svg';
import add from 'assets/img/icons/buttons/add.svg';
import { Button } from 'reactstrap';
import { CardNumberScanner } from './CardNumberScanner';
import IconButton from 'components/wrapped/IconButton';

function isHold(crew: ScannedPersonsType){
    return false;
}

export function CrewIcons(props: {skipper: ScannedPersonsType}){
    return <div className="flex flex-row">
            {props.skipper.bannerComment.isSome() ? <img src={hold} width={50}/> : <></>}
            {isHold(props.skipper) ? <img src={comments} width={50}/> : <></>}
        </div>;
}

export function DetailedPersonInfo(props: MemberActionProps & {person: number}) {
    const currentPerson = props.state.currentPeople[props.person];
    if(!currentPerson.isSkipper && props.mode != SignoutActionMode.TESTING)
        return <></>;
    if(!currentPerson.isTesting && props.mode == SignoutActionMode.TESTING)
        return <></>;
    const scannedPersonsCache = React.useContext(ScannedPersonsCacheContext);
    const personCached = scannedPersonsCache.getCached(props.state.currentPeople[props.person].cardNum);
    if(personCached.isNone()){
        return <></>;
    }
    const currentMembership = personCached.value.activeMemberships[0];
    const programHR = getProgramHR(currentMembership.programId.getOrElse(-1));
    return <div className="flex flex-row grow-0 gap-5">
        <div className="flex flex-col">
            <h3 className="font-bold">{props.mode == SignoutActionMode.TESTING ? "Testing:" : "Skipper:"}</h3>
            <CrewIcons skipper={personCached.value} />
            <h3 className="text-2xl font-bold">{personCached.value.nameFirst} {personCached.value.nameLast}</h3>
            <h3 className="text-xl">{programHR}</h3>
            <h3 className="text-xl">{currentMembership.membershipTypeId} TODO make this HR</h3>
            <h3 className="text-xl">{currentMembership.expirationDate.getOrElse("")}</h3>
            <h3 className="text-xl">Guest Privileges: {currentMembership.hasGuestPrivs ? "Yes" : "No"}</h3>
        </div>
        <div className="flex flex-col">
            <img src={person} className="mt-auto mb-0 border-r pr-5 border-black"></img>
        </div>
    </div>;
}

export function AddEditCrew(props: MemberActionProps){
    return (
        <div className="flex flex-col">
            <h3 className="font-bold">Crew:</h3>
            <div className="flex flex-row gap-5">
                <AddCrew {...props}></AddCrew>
                <EditCrew {...props}></EditCrew>
            </div>
        </div>);
}

export function AddCrew(props: MemberActionProps){
    const setRandom = (e) => {
        //props.setState((state) => ({...state, currentPeople: state.currentPeople.map((a) => )}));
    }
    return (<div className="flex flex-col grow-0 gap-2">
            {props.mode == SignoutActionMode.SIGNOUT ? <div className="flex flex-row gap-2">
                <Button className="bg-gray-200">Search Phone</Button>
                <Button className="bg-gray-200">Search Name</Button>
            </div> : <></>}
            <CardNumberScanner label="Add person..." onAction={(a) => {
                props.setState((s) => ({...s, currentPeople: s.currentPeople.concat({cardNum: a.cardNumber, isSkipper: false, isTesting: false, sortOrder: 0})}));
            }}></CardNumberScanner>
            {props.mode == SignoutActionMode.SIGNOUT ? <><Button className="bg-gray-200" onClick={setRandom}>Find Highest Ratings</Button>
            <Button className="bg-gray-200" onClick={setRandom}>Find Highest Privileges</Button></> : <></>}
        </div>);
}

function EditCrewButton(props: {src: string, onClick: (e) => void, mode: SignoutActionMode}){
    const showButton = props.mode != SignoutActionMode.RATINGS && props.mode != SignoutActionMode.COMMENTS;
    return <>{showButton ? <IconButton src={props.src} className="h-[24px]" onClick={props.onClick}/> : <></>}</>;
}

export function EditCrew(props: MemberActionProps){
    const iconTwo = props.mode == SignoutActionMode.TESTING ? add : swap;
    const cache = React.useContext(ScannedPersonsCacheContext);
    const crew = <>{props.state.currentPeople.map((a, i) => {
        const b = cache.getCached(a.cardNum);
        if(a.isSkipper && props.mode != SignoutActionMode.TESTING)
            return undefined;
        if(a.isTesting && props.mode == SignoutActionMode.TESTING)
            return undefined;
        if(b.isNone()){
            return undefined;
        }
        const sv = props.mode != SignoutActionMode.TESTING ? "isSkipper" : "isTesting";
        return (<div key={i} className="whitespace-nowrap">        
            <div className="flex flex-row">
                <EditCrewButton src={x} onClick={() => {props.setState((state) => ({...state, currentPeople: state.currentPeople.filter((b, i2) => i != i2)}))}} mode={props.mode}/>
                <h3 className="font-medium">{b.value.nameFirst} {b.value.nameLast}</h3>
            </div>
            <div className="flex flex-row">
                <EditCrewButton src={iconTwo} onClick={() => {props.setState((state) => ({...state, currentPeople: state.currentPeople.map((b, i2) => ({...b, ...{[sv]: i == i2}}))}))}} mode={props.mode}/>
                <h3 className="font-light">{getProgramHR(b.value.activeMemberships[0].programId.getOrElse(undefined))}</h3>
            </div>
        </div>)})}</>;
    return (<div className={"grid grow-[1] gap-5 " + ((props.mode != SignoutActionMode.TESTING) ? "grid-cols-4 grid-rows-2" : "grid-cols-2 grid-rows-2")}>{crew}</div>)
}
