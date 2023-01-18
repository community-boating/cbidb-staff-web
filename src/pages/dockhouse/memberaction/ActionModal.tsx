import { Tab } from '@headlessui/react';
import Modal, { ModalHeader } from 'components/wrapped/Modal';
import * as React from 'react';

import * as t from "io-ts";

import hold from 'assets/img/icons/hold.svg';
import comments from 'assets/img/icons/comments.svg';
import person from 'assets/img/icons/person.svg';
import { option } from 'fp-ts';
import { programsHR } from '../signouts/Constants';
import Button from 'components/wrapped/Button';
import { CustomInput as Input, SelectInput } from 'components/wrapped/Input';

import swap from 'assets/img/icons/buttons/swap.svg';
import x from 'assets/img/icons/buttons/x.svg';
import add from 'assets/img/icons/buttons/add.svg';
import IconButton from 'components/wrapped/IconButton';
import BoatIcon, { BoatSelect } from './BoatIcon';
import { scanCardValidator } from 'async/staff/dockhouse/scan-card';
import RatingsGrid from './RatingsGrid';
import { ScannedPersonsCacheContext } from './ScannedPersonsCache';

export type ScannedPersonsType = t.TypeOf<typeof scanCardValidator>;

export type ScannedCrewType = ScannedPersonsType[];

export type MemberActionState = {
    crewCardNums: string[]
    currentSkipperCardNum: string
    currentTestingCardNums: string[]
    boatId: option.Option<number>
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
    const skipper = scannedPersonsCache.getCached(props.state.currentSkipperCardNum);
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

export function AddCrew(props: SignoutProps & {mode: MemberActionMode}){
    const setRandom = (e) => {
        //props.setState((state) => ({...state, currentSkipper: Math.floor(Math.random()*state.crew.length)}));
    }
    return (<div className="flex flex-col grow-0 gap-2">
            {props.mode == MemberActionMode.SIGNOUT ? <div className="flex flex-row gap-2">
                <Button className="bg-gray-200 p-card">Search Phone</Button>
                <Button className="bg-gray-200 p-card">Search Name</Button>
            </div> : <></>}
            <Input label="add person..." onEnter={() => {
                const rand = Math.floor(Math.random()*4);
                //props.setState((state) => ({...state, crew: ([testCrew[rand]].concat(state.crew.concat())), currentSkipper: state.currentSkipper + 1}));
            }}></Input>
            {props.mode == MemberActionMode.SIGNOUT ? <><Button className="bg-gray-200 p-card" onClick={setRandom}>Find Highest Ratings</Button>
            <Button className="bg-gray-200 p-card" onClick={setRandom}>Find Highest Privileges</Button></> : <></>}
        </div>);
}

function EditCrewButton(props: {src: string, onClick: (e) => void, mode: MemberActionMode}){
    return <>{props.mode != MemberActionMode.OTHER ? <IconButton src={props.src} className="h-[24px]" onClick={props.onClick}/> : <></>}</>;
}

export function EditCrew(props: SignoutProps & {mode: MemberActionMode}){
    const iconTwo = props.mode == MemberActionMode.SIGNOUT ? swap : add;
    return <></>;
    /*const crew = <>{props.state.crew.map((a, i) => (i != props.state.currentSkipper) ? (<div key={i} className="whitespace-nowrap">        
            <div className="flex flex-row">
                <EditCrewButton src={x} onClick={() => {props.setState((state) => ({...state, crew: state.crew.filter((a, i2) => i2 != i), currentSkipper: Math.min(state.currentSkipper, state.crew.length - 2)}))}} mode={props.mode}/>
                <h3 className="font-medium">{a.nameFirst} {a.nameLast}</h3>
            </div>
            <div className="flex flex-row">
                <EditCrewButton src={iconTwo} onClick={() => {props.setState((state) => ({...state, currentSkipper: i}))}} mode={props.mode}/>
                <h3 className="font-light">{getProgramHR(a.activeMemberships[0].programId)}</h3>
            </div>
        </div>)
        : undefined)}</>;
    return (<div className={"grid grow-[1] gap-5 " + (props.mode != MemberActionMode.TESTING ? "grid-cols-4 grid-rows-2" : "grid-cols-2 grid-rows-2")}>{crew}</div>)*/
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

export enum PrimaryActionModalMode{
    MEMBER_ACTIONS,
    EDIT_SIGNOUT
}

export type ActionModalProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function MemberActionModal(props){
    const [state, setState] = React.useState({crewCardNums: [], currentSkipperCardNum: "1234567", currentTestingCardNums: [], boatId: option.none});
    return <Tab.Group>
        <ModalHeader>
            <Tab.List className="flex flex-row gap-primary">
                <h1 className="text-2xl font-bold">Member Actions:</h1>
                {memberActionTypes.map((a, i) => <Tab key={i} as={React.Fragment}>
                    {({selected}) => (
                        <div className="flex flex-row gap-primary">
                            {(i > 0 ? <span onClick={(e) => {e.preventDefault()}}><h1 className="text-2xl">|</h1></span> : "")}
                            <button className={"text-2xl inline" + (selected ? " text-boathouseblue font-bold" : " underline")}>{a.title}</button>
                        </div>
                    )}
                </Tab>)
                }
            </Tab.List>
        </ModalHeader>
        <hr className="border-t-1 border-black"/>
        <Tab.Panels className="h-[80vh] min-w-[80vw] flex flex-col">
            {memberActionTypes.map((a, i) => <Tab.Panel className="grow-[1]" key={i}>{a.getContent(state, setState)}</Tab.Panel>)}
        </Tab.Panels>
        <>
            <div className="flex flex-row gap-2 mr-0 ml-auto">
                <Button className="bg-gray-300 px-5 py-2">Queue Signout</Button>
                <Button className="bg-gray-300 px-5 py-2">Queue Signout</Button>
            </div>
        </>
    </Tab.Group>
}

export default function ActionModal(props: ActionModalProps){
    return (
    
        <Modal {...props} className="bg-gray-100 rounded-lg">
            <MemberActionModal></MemberActionModal>
        </Modal>);
}

type GeneralPersonInfo = {
    personId: number
    cardNumber: string
    [key: string | number | symbol]: any
}