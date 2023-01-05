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
import { Input, ValidatedSelectInput } from 'components/wrapped/Input';

import swap from 'assets/img/icons/buttons/swap.svg';
import x from 'assets/img/icons/buttons/x.svg';
import IconButton from 'components/wrapped/IconButton';
import BoatIcon, { BoatSelect } from './BoatIcon';
import { scanCardValidator } from 'async/staff/dockhouse/scan-card';
import RatingsGrid from './RatingsGrid';

type ScannedPersonsType = t.TypeOf<typeof scanCardValidator>;

export type ScannedCrewType = ScannedPersonsType[];

type SignoutState = {
    crew: ScannedCrewType;
    currentSkipper: number;
    boatId: option.Option<number>;
}

export type SignoutProps = {
    state: SignoutState;
    setState: React.Dispatch<React.SetStateAction<SignoutState>>;
}

function getProgramHR(programId: number){
    return ((programsHR.filter((a) => a.value == programId)[0]) || {display: "Invalid Program"}).display;
}

function isHold(crew: ScannedPersonsType){
    return true;
}

export function SkipperInfo(props: SignoutProps){
    const skipper = props.state.crew[props.state.currentSkipper];
    const currentMembership = skipper.activeMemberships[0];
    const programHR = getProgramHR(currentMembership.programId);
    return <div className="flex flex-row grow-0 gap-5">
        <div className="flex flex-col">
            <h3 className="font-bold">Skipper:</h3>
            <div className="flex flex-row">
                {skipper.bannerComment.isSome() ? <img src={hold} width={50}/> : <></>}
                {isHold(skipper) ? <img src={comments} width={50}/> : <></>}
            </div>
            <h3 className="text-2xl font-bold">{skipper.nameFirst} {skipper.nameLast}</h3>
            <h3 className="text-xl">{programHR}</h3>
            <h3 className="text-xl">{currentMembership.membershipTypeId} TODO make this HR</h3>
            <h3 className="text-xl">{currentMembership.expirationDate.getOrElse("")}</h3>
            <h3 className="text-xl">Guest Privileges: {currentMembership.hasGuestPrivs ? "Yes" : "No"}</h3>
        </div>
        <div className="flex flex-col">
            <img src={person} className="mt-auto mb-0"></img>
        </div>
    </div>
}

export enum AddCrewMode{
    SIGNOUT, NORMAL
}

export function AddCrew(props: SignoutProps & {mode: AddCrewMode}){
    const setRandom = (e) => {
        props.setState((state) => ({...state, currentSkipper: Math.floor(Math.random()*state.crew.length)}));
    }
    return (<div className="flex flex-col grow-0 gap-2">
            {props.mode == AddCrewMode.SIGNOUT ? <div className="flex flex-row gap-2">
                <Button className="bg-gray-200 p-card">Search Phone</Button>
                <Button className="bg-gray-200 p-card">Search Name</Button>
            </div> : <></>}
            <Input label="add person..." onEnter={() => {
                const rand = Math.floor(Math.random()*4);
                props.setState((state) => ({...state, crew: ([testCrew[rand]].concat(state.crew.concat())), currentSkipper: state.currentSkipper + 1}));
            }}></Input>
            {props.mode == AddCrewMode.SIGNOUT ? <><Button className="bg-gray-200 p-card" onClick={setRandom}>Find Highest Ratings</Button>
            <Button className="bg-gray-200 p-card" onClick={setRandom}>Find Highest Privileges</Button></> : <></>}
        </div>);
}

export function EditCrew(props: SignoutProps){
    return (<div className="grid grid-rows-2 grid-cols-4 grow-[1]">
            {props.state.crew.map((a, i) => (i != props.state.currentSkipper) ? <div key={i} className="flex flex-row my-auto">
                <div className="w-[1em]">
                    <IconButton src={x} onClick={() => {props.setState((state) => ({...state, crew: state.crew.filter((a, i2) => i2 != i), currentSkipper: Math.min(state.currentSkipper, state.crew.length - 2)}))}}/>
                    <IconButton src={swap} onClick={() => {props.setState((state) => ({...state, currentSkipper: i}))}}/>
                </div>
                <div>
                    <h3 className="font-medium">{a.nameFirst} {a.nameLast}</h3>
                    <h3 className="font-light">{getProgramHR(1)}</h3>
                    </div>
                </div>
                : undefined)}
        </div>)
}

const testMemberships: ScannedPersonsType["activeMemberships"] = [{
    startDate: option.some("1992"),
    expirationDate: option.some("12/20/2022"),
    membershipTypeId: 0,
    programId: 1,
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
    personsRatings: []
};

const b = {
    nameFirst: "Joon",
    nameLast: "Coal",
    personId: 100, 
    cardNumber: "1234567",
    activeMemberships:testMemberships,
    bannerComment: option.some("Comment Here"),
    specialNeeds: option.none,
    personsRatings: []
}

const c = {
    nameFirst: "Pawl",
    nameLast: "Gammind",
    personId: 100, 
    cardNumber: "1234567",
    activeMemberships:testMemberships,
    bannerComment: option.some("Comment Here"),
    specialNeeds: option.none,
    personsRatings: []
}

const d = {
    nameFirst: "Samp",
    nameLast: "Peersin",
    personId: 100, 
    cardNumber: "1234567",
    activeMemberships:testMemberships,
    bannerComment: option.some("Comment Here"),
    specialNeeds: option.none,
    personsRatings: []
}

const testCrew = [testSkipper, b, c, d]

export function DotBox(props: {className?: string, children: React.ReactNode}){
    return <div className={"my-5 py-5 border-dashed border-2 " + props.className}>
        {props.children}
    </div>
}

export function DialogOutput(props: {children: React.ReactNode}){
    return <div className="bg-card w-full">{props.children}</div>;
}

const memberActionTypes: {title: React.ReactNode, getContent: (state: SignoutState, setState: React.Dispatch<React.SetStateAction<SignoutState>>) => React.ReactNode}[] = [{
    title: "Sign Out",
    getContent: (state, setState) => { 
        const setBoatId = (boatId: option.Option<number>) => {
            setState({...state, boatId: boatId})
        };
        return (
        <div className="flex flex-col h-full grow-[1] gap-5">
            <div className="flex flex-row grow-[0] gap-5">
                <SkipperInfo state={state} setState={setState}></SkipperInfo>
                <AddCrew state={state} setState={setState} mode={AddCrewMode.SIGNOUT}></AddCrew>
                <EditCrew state={state} setState={setState}></EditCrew>
            </div>
            <div className="flex flex-row grow-[1]">
                <DialogOutput>
                    <p>Dialog Output</p>
                </DialogOutput>
            </div>
            <div className="flex flex-row grow-[3]">
                <div className="w-full flex flex-col">
                    <p>Boat Type</p>
                    <BoatIcon boatId={state.boatId} setBoatId={setBoatId}/>
                    <DotBox className="grow-[1]">
                        <BoatSelect boatId={state.boatId} setBoatId={setBoatId}></BoatSelect>
                    </DotBox>
                    <div className="flex flex-row gap-2 mr-0 ml-auto">
                        <Button className="bg-gray-300 px-5 py-2">Queue Signout</Button>
                        <Button className="bg-gray-300 px-5 py-2">Queue Signout</Button>
                    </div>
                </div>
            </div>
        </div>)}
},
{
    title: "Testing",
    getContent: (state, setState) => { 
        const setBoatId = (boatId: option.Option<number>) => {
            setState({...state, boatId: boatId})
        };
        return (
        <div className="flex flex-col h-full grow-[1] gap-5">
            <div className="flex flex-row grow-[0] gap-5">
                <SkipperInfo state={state} setState={setState}></SkipperInfo>
                <SkipperInfo state={state} setState={setState}></SkipperInfo>
                <AddCrew state={state} setState={setState} mode={AddCrewMode.NORMAL}></AddCrew>
                <EditCrew state={state} setState={setState}></EditCrew>
            </div>
            <div className="flex flex-row grow-[1]">
                <DialogOutput>
                    <p>Dialog Output</p>
                </DialogOutput>
                <DialogOutput>
                    <p>Dialog Output</p>
                </DialogOutput>
                <DialogOutput>
                    <p>Dialog Output</p>
                </DialogOutput>
            </div>
            <div className="flex flex-row grow-[3]">
                <div className="w-full flex flex-col">
                    <p>Boat Type</p>
                    <BoatIcon boatId={state.boatId} setBoatId={setBoatId}/>
                    <DotBox>
                        <BoatSelect boatId={state.boatId} setBoatId={setBoatId}></BoatSelect>
                    </DotBox>
                    <div className="flex flex-row gap-2 mr-0 ml-auto">
                        <Button className="bg-gray-300 px-5 py-2">Queue Signout</Button>
                        <Button className="bg-gray-300 px-5 py-2">Queue Signout</Button>
                    </div>
                </div>
            </div>
        </div>)}
},
{
    title: "Ratings",
    getContent: (state, setState) => (<div>
        <MemberActionRatings state={state} setState={setState}></MemberActionRatings>
    </div>)
},
{
    title: "Classes",
    getContent: () => (<div>View ap class management for scanned person</div>)
},
{
    title: "Comments",
    getContent: () => (
        <div>

        </div>)
}]

function MemberActionRatings(props: {state: SignoutState, setState: React.Dispatch<React.SetStateAction<SignoutState>>}){
    const availablePrograms = {};
    props.state.crew.forEach((a) => availablePrograms[a.activeMemberships[0].programId] = true);
    const [programId, setProgramId] = React.useState<option.Option<number>>(option.none);
    const [selectedRatings, setSelectedRatings] = React.useState<{[key: number]: boolean}>({});
    return <div>
            <AddCrew {...props} mode={AddCrewMode.NORMAL}></AddCrew>
            <EditCrew {...props}></EditCrew>
            <ValidatedSelectInput initValue={programId} updateValue={setProgramId} selectOptions={programsHR.filter((a) => availablePrograms[a.value])} validationResults={[]}></ValidatedSelectInput>
           <RatingsGrid selectedProgram={programId} selectedRatings={selectedRatings} setSelectedRatings={setSelectedRatings}></RatingsGrid>
        </div>
}

export type MemberActionModalProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MemberActionModal(props: MemberActionModalProps){
    const [state, setState] = React.useState({crew: testCrew, currentSkipper: 0, boatId: option.none});
    const header = (
        <Tab.List className="flex flex-row gap-primary">
            <h1 className="text-2xl font-bold">Member Actions:</h1>
            {memberActionTypes.map((a, i) => <Tab key={i} as={React.Fragment}>
                {({selected}) => (
                    <div className="flex flex-row gap-primary">
                        {(i > 0 ? <a><h1 className="text-2xl">|</h1></a> : "")}
                        <a className={"text-2xl inline" + (selected ? " text-blue-500" : "")}>{a.title}</a>
                    </div>
                )}
            </Tab>)
            }
        </Tab.List>);
    return (
    <Tab.Group>
        <Modal {...props} className="bg-gray-100 rounded-lg">
            <ModalHeader>{header}</ModalHeader>
            <hr className="border-t-1 border-black"/>
            <Tab.Panels className="h-[80vh] w-[80vw] flex flex-col">
                {memberActionTypes.map((a, i) => <Tab.Panel className="grow-[1]" key={i}>{a.getContent(state, setState)}</Tab.Panel>)}
            </Tab.Panels>
        </Modal>
    </Tab.Group>);
}

type GeneralPersonInfo = {
    personId: number
    cardNumber: string
    [key: string | number | symbol]: any
}

export function adaptPerson(partialCrew: Partial<GeneralPersonInfo>): ScannedPersonsType{
	return testSkipper;
}