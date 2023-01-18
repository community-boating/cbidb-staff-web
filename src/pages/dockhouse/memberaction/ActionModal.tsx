import { Tab } from '@headlessui/react';
import Modal, { ModalHeader } from 'components/wrapped/Modal';
import * as React from 'react';

import * as t from "io-ts";

import hold from 'assets/img/icons/hold.svg';
import comments from 'assets/img/icons/comments.svg';
import person from 'assets/img/icons/person.svg';
import { option } from 'fp-ts';
import { programsHR, SignoutTypes, signoutTypesHR } from '../signouts/Constants';
import Button from 'components/wrapped/Button';
import { CustomInput as Input, SelectInput } from 'components/wrapped/Input';

import swap from 'assets/img/icons/buttons/swap.svg';
import x from 'assets/img/icons/buttons/x.svg';
import add from 'assets/img/icons/buttons/add.svg';
import IconButton, { GoButton } from 'components/wrapped/IconButton';
import BoatIcon, { BoatSelect } from './BoatIcon';
import { scanCardValidator } from 'async/staff/dockhouse/scan-card';
import RatingsGrid from './RatingsGrid';
import { ScannedPersonsCacheContext } from './ScannedPersonsCache';
import { EditSignoutType, SignoutTablesState } from '../signouts/StateTypes';
import RadioGroup from 'components/wrapped/RadioGroup';

export type ScannedPersonsType = t.TypeOf<typeof scanCardValidator>;

export type ScannedCrewType = ScannedPersonsType[];

export type MemberActionState = {
    currentPeopleCardNums: string[]
    currentSkipper: number
    currentTesting: number[]
    boatId: option.Option<number>
}

export type EditSignoutState = MemberActionState & {
    type: string
}

export type SignoutProps = {
    state: MemberActionState
    setState: React.Dispatch<React.SetStateAction<MemberActionState>>
}

function getProgramHR(programId: number){
    return ((programsHR.filter((a) => a.value == programId)[0]) || {display: "Invalid Program"}).display;
}

function isHold(crew: ScannedPersonsType){
    return false;
}

function CrewIcons(props: {skipper: ScannedPersonsType}){
    return <div className="flex flex-row">
            {props.skipper.bannerComment.isSome() ? <img src={hold} width={50}/> : <></>}
            {isHold(props.skipper) ? <img src={comments} width={50}/> : <></>}
        </div>;
}

export function SkipperInfo(props: SignoutProps){
    const scannedPersonsCache = React.useContext(ScannedPersonsCacheContext);
    if(props.state.currentSkipper == undefined)
        return <></>;
    const skipper = scannedPersonsCache.getCached(props.state.currentPeopleCardNums[props.state.currentSkipper]);
    if(skipper.isNone())
        return <></>;
    const currentMembership = skipper.value.activeMemberships[0];
    const programHR = getProgramHR(currentMembership.programId.getOrElse(-1));
    return <div className="flex flex-row grow-0 gap-5">
        <div className="flex flex-col">
            <h3 className="font-bold">Skipper:</h3>
                <CrewIcons skipper={skipper.value}/>
            <h3 className="text-2xl font-bold">{skipper.value.nameFirst} {skipper.value.nameLast}</h3>
            <h3 className="text-xl">{programHR}</h3>
            <h3 className="text-xl">{currentMembership.membershipTypeId} TODO make this HR</h3>
            <h3 className="text-xl">{currentMembership.expirationDate.getOrElse("")}</h3>
            <h3 className="text-xl">Guest Privileges: {currentMembership.hasGuestPrivs ? "Yes" : "No"}</h3>
        </div>
        <div className="flex flex-col">
            <img src={person} className="mt-auto mb-0 border-r pr-5 border-black"></img>
        </div>
    </div>
}

export enum MemberActionMode{
    SIGNOUT, TESTING, OTHER
}

export function AddEditCrew(props: SignoutProps & {mode: MemberActionMode}){
    return (
        <div className="flex flex-col">
            <h3 className="font-bold">Crew:</h3>
            <div className="flex flex-row gap-5">
                <AddCrew {...props}></AddCrew>
                <EditCrew {...props}></EditCrew>
            </div>
        </div>);
}

export function CardNumberScanner(props: ({label: string, onAction: (result: ScannedCrewType[number]) => void})){
    const [cardNum, setCardNum] = React.useState<option.Option<string>>(option.none);
    const [foundPerson, setFoundPerson] = React.useState<option.Option<ScannedCrewType[number]>>(option.none);
    const [error, setError] = React.useState<option.Option<string>>(option.none);
    const [actionQueued, setActionQueued] = React.useState<option.Option<string>>(option.none);
    const timeoutID = React.useRef<NodeJS.Timeout>(undefined);
    const context = React.useContext(ScannedPersonsCacheContext);
    const findCardNum = (cardNum: string) => {
        setCardNum(cardNum == "" ? option.none : option.some(cardNum));
        if(timeoutID.current){
            clearTimeout(timeoutID.current);
        }
        timeoutID.current = setTimeout(() => {
            console.log("trying");
            context.getCached(cardNum, (result) => {
                console.log("resulting");
                if(result.isSome()){
                    setFoundPerson(option.some(result.value));
                    setError(option.none);
                }else{
                    setFoundPerson(option.none);
                    setError(option.some("Couldn't find person"));
                }
                timeoutID.current = undefined;
            });
        }, 200);
    }
    const addCardNumToCrew = () => {
        if(foundPerson.isSome() && actionQueued.isSome() && actionQueued.value == foundPerson.value.cardNumber){
            props.onAction(foundPerson.value);
            setActionQueued(option.none);
        }
    }
    React.useEffect(() => {
        addCardNumToCrew();
    }, [foundPerson, actionQueued]);
    const doQueue = () => {
        setActionQueued(cardNum);
    }
    return <div>
        <Input label={props.label} value={cardNum.getOrElse("")} end={<GoButton onClick={() => {doQueue();}}/>} onChange={(e) => {e.preventDefault(); findCardNum(e.target.value);}} onEnter={() => {
        doQueue();
        }}></Input>
        {foundPerson.isSome() ? (foundPerson.value.nameFirst + " " + foundPerson.value.nameLast) : ""}
        {error.isSome() ? error.value : ""}
    </div>
}

export function AddCrew(props: SignoutProps & {mode: MemberActionMode}){
    const setRandom = (e) => {
        //props.setState((state) => ({...state, currentSkipper: Math.floor(Math.random()*state.crewCardNums.length)}));
    }
    return (<div className="flex flex-col grow-0 gap-2">
            {props.mode == MemberActionMode.SIGNOUT ? <div className="flex flex-row gap-2">
                <Button className="bg-gray-200 p-card">Search Phone</Button>
                <Button className="bg-gray-200 p-card">Search Name</Button>
            </div> : <></>}
            <CardNumberScanner label="Add person..." onAction={(a) => {
                props.setState((s) => ({...s, currentPeopleCardNums: s.currentPeopleCardNums.concat(a.cardNumber)}));
            }}></CardNumberScanner>
            {props.mode == MemberActionMode.SIGNOUT ? <><Button className="bg-gray-200 p-card" onClick={setRandom}>Find Highest Ratings</Button>
            <Button className="bg-gray-200 p-card" onClick={setRandom}>Find Highest Privileges</Button></> : <></>}
        </div>);
}

function EditCrewButton(props: {src: string, onClick: (e) => void, mode: MemberActionMode}){
    return <>{props.mode != MemberActionMode.OTHER ? <IconButton src={props.src} className="h-[24px]" onClick={props.onClick}/> : <></>}</>;
}

export function EditCrew(props: SignoutProps & {mode: MemberActionMode}){
    const iconTwo = props.mode == MemberActionMode.SIGNOUT ? swap : add;
    const cache = React.useContext(ScannedPersonsCacheContext);
    const crew = <>{props.state.currentPeopleCardNums.map((a, i) => {
        if(i == props.state.currentSkipper){
            return <></>;
        }
        const b = cache.getCached(a);
        if(b.isNone()){
            return <></>;
        }
        return (<div key={i} className="whitespace-nowrap">        
            <div className="flex flex-row">
                <EditCrewButton src={x} onClick={() => {props.setState((state) => ({...state, currentPeopleCardNums: state.currentPeopleCardNums.filter((a, i2) => i2 != i), currentSkipper: Math.min(state.currentSkipper, state.currentPeopleCardNums.length - 2)}))}} mode={props.mode}/>
                <h3 className="font-medium">{b.value.nameFirst} {b.value.nameLast}</h3>
            </div>
            <div className="flex flex-row">
                <EditCrewButton src={iconTwo} onClick={() => {props.setState((state) => ({...state, currentSkipper: i}))}} mode={props.mode}/>
                <h3 className="font-light">{getProgramHR(b.value.activeMemberships[0].programId.getOrElse(undefined))}</h3>
            </div>
        </div>)})}</>;
    return (<div className={"grid grow-[1] gap-5 " + ((props.mode != MemberActionMode.TESTING) ? "grid-cols-4 grid-rows-2" : "grid-cols-2 grid-rows-2")}>{crew}</div>)
}

export const testMemberships: ScannedPersonsType["activeMemberships"] = [{
    startDate: option.some("1992"),
    expirationDate: option.some("12/20/2022"),
    membershipTypeId: 0,
    programId: option.some(1),
    isDiscountFrozen: false,
    hasGuestPrivs: true,
    assignId: 0,
    discountName: option.none,
}];

const testSkipper: ScannedPersonsType = {
    nameFirst: "Evan",
    nameLast: "McCarter",
    personId: 100, 
    cardNumber: "1234567",
    activeMemberships:testMemberships,
    bannerComment: option.some("Comment Here"),
    specialNeeds: option.none,
    personRatings: []
};

const b = {
    nameFirst: "Joon",
    nameLast: "Coal",
    personId: 100, 
    cardNumber: "1234567",
    activeMemberships:testMemberships,
    bannerComment: option.some("Comment Here"),
    specialNeeds: option.none,
    personRatings: []
}

const c = {
    nameFirst: "Pawl",
    nameLast: "Gammind",
    personId: 100, 
    cardNumber: "1234567",
    activeMemberships:testMemberships,
    bannerComment: option.some("Comment Here"),
    specialNeeds: option.none,
    personRatings: []
}

const d = {
    nameFirst: "Samp",
    nameLast: "Peersin",
    personId: 100, 
    cardNumber: "1234567",
    activeMemberships:testMemberships,
    bannerComment: option.some("Comment Here"),
    specialNeeds: option.none,
    personRatings: []
}

const testCrew = [testSkipper, b, c, d]

export function DotBox(props: {className?: string, children: React.ReactNode}){
    return <div className={"my-5 py-5 border-dashed border-2 grow-[1] " + props.className}>
        {props.children}
    </div>
}

export function DialogOutput(props: {children: React.ReactNode}){
    return <div className="bg-card w-full">{props.children}</div>;
}

export function EditSignout(props: {state: MemberActionState, setState: React.Dispatch<React.SetStateAction<MemberActionState>>, mode: MemberActionMode}){
    const setBoatId = (boatId: option.Option<number>) => {
        props.setState({...props.state, boatId: boatId})
    };
    const {mode, ...other} = props;
    return (
    <div className="flex flex-col h-full grow-[1] gap-5">
        <div className="flex flex-row grow-[0] gap-5">
            <SkipperInfo {...other}></SkipperInfo>
            {props.mode == MemberActionMode.TESTING ? <SkipperInfo {...other}></SkipperInfo> : <></>}
            <AddEditCrew {...props}></AddEditCrew>
        </div>
        <div className="flex flex-row grow-[1]">
            <DialogOutput>
                <p>Dialog Output</p>
            </DialogOutput>
        </div>
        <div className="flex flex-row grow-[3]">
            <div className="w-full flex flex-col">
                <p>Boat Type</p>
                <BoatIcon boatId={props.state.boatId} setBoatId={setBoatId}/>
                <DotBox className="grow-[1]">
                    <BoatSelect boatId={props.state.boatId} setBoatId={setBoatId}></BoatSelect>
                </DotBox>
            </div>
        </div>
    </div>);
}

const memberActionTypes: {title: React.ReactNode, getContent: (state: MemberActionState, setState: React.Dispatch<React.SetStateAction<MemberActionState>>) => React.ReactNode}[] = [{
    title: "Sign Out",
    getContent: (state, setState) => <>
        <EditSignout state={state} setState={setState} mode={MemberActionMode.SIGNOUT}/>
    </>
},
{
    title: "Testing",
    getContent: (state, setState) => <>
        <EditSignout state={state} setState={setState} mode={MemberActionMode.TESTING}/>
    </>
},
{
    title: "Classes",
    getContent: () => (<div>View ap class management for scanned person</div>)
},
{
    title: "Racing",
    getContent: (state, setState) => <>
        <EditSignout state={state} setState={setState} mode={MemberActionMode.SIGNOUT}/>
    </>
},
{
    title: "Ratings",
    getContent: (state, setState) => (<div>
        <MemberActionRatings state={state} setState={setState}></MemberActionRatings>
    </div>)
},
{
    title: "Comments",
    getContent: (state, setState) => (
        <div>
            <AddEditCrew state={state} setState={setState} mode={MemberActionMode.OTHER}></AddEditCrew>
            <textarea cols={100} rows={20}></textarea>
        </div>)
}]

function MemberActionRatings(props: {state: MemberActionState, setState: React.Dispatch<React.SetStateAction<MemberActionState>>}){
    const availablePrograms = {};
    //props.state.crew.forEach((a) => availablePrograms[a.activeMemberships[0].programId] = true);
    const [programId, setProgramId] = React.useState<option.Option<number>>(option.none);
    const [selectedRatings, setSelectedRatings] = React.useState<{[key: number]: boolean}>({});
    return <div>
            <AddEditCrew state={props.state} setState={props.setState} mode={MemberActionMode.OTHER}></AddEditCrew>
            <SelectInput initValue={programId} updateValue={setProgramId} selectOptions={programsHR.filter((a) => availablePrograms[a.value])} validationResults={[]}></SelectInput>
            <RatingsGrid selectedProgram={programId} selectedRatings={selectedRatings} setSelectedRatings={setSelectedRatings}></RatingsGrid>
        </div>
}

export type ActionModalProps = {
    action: Action<any>
    setAction: (action: Action<any>) => void
}

export abstract class Action<T>{
    modeInfo: T
    createModalContent(info: T): React.ReactNode{return undefined}
}

type MemberActionType = {
    scannedCard: string
}

export class MemberAction extends Action<MemberActionType>{
    constructor(scannedCard: string){
        super();
        this.modeInfo = {scannedCard};
    }
    createModalContent(info: MemberActionType){
        return <MemberActionModal {...info}></MemberActionModal>
    } 
}

export class EditSignoutAction extends Action<EditSignoutType>{
    constructor(row: SignoutTablesState, onSubmit: (row: SignoutTablesState) => Promise<any>){
        super();
        this.modeInfo = {
            currentSignout: row,
            onSubmit: onSubmit
        }
    }
    createModalContent(info: EditSignoutType){
        return <EditSignoutModal {...info}></EditSignoutModal>
    }
}

export class NoneAction extends Action<undefined>{
}


function MemberActionModal(props: MemberActionType){
    const [state, setState] = React.useState({currentPeopleCardNums: [props.scannedCard], currentSkipper: 0, currentTesting: [], boatId: option.none});
    return <Tab.Group>
        <ModalHeader className="text-2xl font-bold">
            <Tab.List className="flex flex-row gap-primary">
                <h1>Member Actions:</h1>
                {memberActionTypes.map((a, i) => <Tab key={i} as={React.Fragment}>
                    {({selected}) => (
                        <div className="flex flex-row gap-primary">
                            {(i > 0 ? <span onClick={(e) => {e.preventDefault()}}><h1>|</h1></span> : "")}
                            <button className={"inline" + (selected ? " text-boathouseblue font-bold" : " underline")}>{a.title}</button>
                        </div>
                    )}
                </Tab>)
                }
            </Tab.List>
        </ModalHeader>
        <hr className="border-t-1 border-black"/>
        <Tab.Panels className="h-[80vh] min-w-[80vw] flex flex-col">
            {memberActionTypes.map((a, i) => <Tab.Panel className="grow-[1]" key={i}>{a.getContent(state, setState, )}</Tab.Panel>)}
        </Tab.Panels>
        <>
            <div className="flex flex-row gap-2 mr-0 ml-auto">
                <Button className="bg-gray-300 px-5 py-2">Queue Signout</Button>
                <Button className="bg-gray-300 px-5 py-2">Queue Signout</Button>
            </div>
        </>
    </Tab.Group>
}

function adaptSignoutState(state: SignoutTablesState): EditSignoutState{
	return {
		currentPeopleCardNums: [state.cardNum.getOrElse(undefined)].concat(state.$$crew.map((a) => a.cardNum.getOrElse(undefined))),
		currentSkipper: 0,
		currentTesting: [],
		boatId: option.some(state.boatId),
        type: state.signoutType
	}
}

const makeNode = (index: number, display: React.ReactNode) => (checked: boolean, setValue) => {
	return <h1 className={"flex " + (checked ? "text-boathouseblue" : "")} key={index}>{display}</h1>;
}

function EditSignoutModal(props: EditSignoutType){
    const [state, setState] = React.useState(adaptSignoutState(props.currentSignout));
    console.log(state.type);
    console.log("changing");
    const mode = state.type == SignoutTypes.TEST ? MemberActionMode.TESTING : MemberActionMode.SIGNOUT;
        return <>
			<ModalHeader className="font-bold text-2xl gap-1">
				<RadioGroup className="flex flex-row" value={option.some(state.type)} setValue={(v) => setState((s) => ({...s, type: v.getOrElse("")}))} makeChildren={signoutTypesHR.map((a,i) => ({value: a.value, makeNode: (c, s) => {return makeNode(i, a.display)(c, s)}}))}/>
			</ModalHeader>
				<div className="w-[80vw] h-[80vh] p-5">
					<EditSignout state={state} setState={setState} mode={mode}/>
				</div>
			</>
}

export default function ActionModal(props: ActionModalProps){
    const modalContent = props.action.createModalContent(props.action.modeInfo);
    return (
        <Modal open={!(props.action instanceof NoneAction)} setOpen={(s) => {if(!s){props.setAction(new NoneAction())}}} className="bg-gray-100 rounded-lg">
            {modalContent}
        </Modal>);
}

type GeneralPersonInfo = {
    personId: number
    cardNumber: string
    [key: string | number | symbol]: any
}