import { Tab } from '@headlessui/react';
import Modal, { ModalContext, ModalHeader } from 'components/wrapped/Modal';
import * as React from 'react';

import * as t from "io-ts";

import { option } from 'fp-ts';
import { programsHR, SignoutTypes, signoutTypesHR, testResultsHR } from '../../../pages/dockhouse/signouts/Constants';
import Button from 'components/wrapped/Button';
import { OptionalStringInput, SelectInput } from 'components/wrapped/Input';

import BoatIcon, { BoatSelect } from './BoatIcon';
import { ScannedPersonsType } from 'async/staff/dockhouse/scan-card';
import RatingsGrid from './RatingsGrid';
import { ScannedPersonsCacheContext, ScannedPersonsCacheGet } from './ScannedPersonsCache';
import { EditSignoutType } from '../../../pages/dockhouse/signouts/StateTypes';
import RadioGroup from 'components/wrapped/RadioGroup';
import { AppStateContext } from 'app/state/AppStateContext';
import { CreateSignoutType, postWrapper as createSignout } from 'async/staff/dockhouse/create-signout';
import { grantRatingsValidator, postWrapper as grantRatings } from 'async/staff/dockhouse/grant-ratings';
import { AddEditCrew, DetailedPersonInfo } from './SkipperInfo';
import { SignoutActionMode, MemberActionState, EditSignoutState } from './MemberActionState';
import { SignoutTablesState } from 'async/staff/dockhouse/signouts';
import { RatingsContext } from 'components/dockhouse/providers/RatingsProvider';

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

export function EditSignout(props: {state: MemberActionState, setState: React.Dispatch<React.SetStateAction<MemberActionState>>, mode: SignoutActionMode}){
    const ratings = React.useContext(RatingsContext);
    const ratingsHR = React.useMemo(() => ratings.map((a) => ({value: a.ratingId, display: a.ratingName})), [ratings]);
    const propsSorted = {...props, state: {...props.state, currentPeople: props.state.currentPeople.sort((a, b) => a.sortOrder - b.sortOrder)}};
    const setBoatId = (boatId: option.Option<number>) => {
        props.setState({...props.state, boatId: boatId})
    };
    return (
    <div className="flex flex-col grow-[1] gap-5">
        <div className="flex flex-row grow-[0] gap-5">
            {props.state.currentPeople.map((a, i) => (<DetailedPersonInfo {...propsSorted} index={i}/>))}
            <AddEditCrew {...propsSorted} />
        </div>
        <div className="flex flex-row grow-[1]">
            <DialogOutput>
                <p>Dialog Output</p>
                <p>{props.state.dialogOutput.isSome() ? props.state.dialogOutput.value : <></>}</p>
            </DialogOutput>
        </div>
        <div className="flex flex-row grow-[3]">
            <div className="w-full flex flex-col">
                <p>Boat Type</p>
                <BoatIcon boatId={props.state.boatId} setBoatId={setBoatId}/>
                <DotBox className="grow-[1] p-5">
                    <div className="flex flex-row gap-5">
                        <div className="flex flex-col items-end gap-5">
                            <BoatSelect boatId={props.state.boatId} setBoatId={setBoatId}></BoatSelect>
                        </div>
                        <div className="flex flex-col items-end gap-5">
                            <OptionalStringInput label="Boat Number:" controlledValue={props.state.boatNum} updateValue={(v) => {props.setState((s) => ({...s, boatNum: v}))}}/>
                            <OptionalStringInput label="Hull Number:" controlledValue={props.state.hullNum} updateValue={(v) => {props.setState((s) => ({...s, hullNum: v}))}}/>
                            <OptionalStringInput label="Sail Number:" controlledValue={props.state.sailNum} updateValue={(v) => {props.setState((s) => ({...s, sailNum: v}))}}/>
                        </div>
                        <div className="flex flex-col items-end gap-5">
                            <SelectInput label="Signout Type:" className="w-[200px]" controlledValue={props.state.signoutType} updateValue={(v) => {props.setState((s) => ({...s, signoutType: v}))}} selectOptions={signoutTypesHR} autoWidth></SelectInput>
                            <SelectInput label="Test Type:" className="w-[200px]" controlledValue={props.state.testType} updateValue={(v) => {props.setState((s) => ({...s, testType: v}))}} selectOptions={testResultsHR} autoWidth></SelectInput>
                            <SelectInput label="Test Rating:" className="w-[200px]" controlledValue={props.state.testRating} updateValue={(v) => {props.setState((s) => ({...s, testRating: v}))}} selectOptions={ratingsHR} autoWidth></SelectInput>
                        </div>
                    </div>
                </DotBox>
            </div>
        </div>
    </div>);
}

export function getSkipper(state: MemberActionState, cache: ScannedPersonsCacheGet){
    const skipperPeople = state.currentPeople.filter((a) => a.isSkipper);
    return skipperPeople.length == 0 ? option.none : cache.getCached(skipperPeople[0].cardNum);
}

function convertToCreateSignout(state: MemberActionState, cache: ScannedPersonsCacheGet): CreateSignoutType{
    const skipper = getSkipper(state, cache);
    if(!skipper.isSome()){
        throw "bad";
    }
    return {
        skipperPersonId: skipper.value.personId,
        skipperCardNumber: skipper.value.cardNumber,
        skipperTestRatingId: state.testRating,
        boatId: state.boatId.getOrElse(undefined),
        sailNumber: state.sailNum,
        hullNumber: state.hullNum,
        classSessionId: option.none,
        isRacing: false,
        dockmasterOverride: false,
        didInformKayakRules: true,
        signoutCrew: state.currentPeople.filter((a) => !a.isSkipper).map((a) => {
            const crewMember = cache.getCached(a.cardNum);
            if(!crewMember.isSome()){
                throw "Tried signing out crew before scanning them in"
            }
            return ({
                personId: crewMember.value.personId,
                cardNumber: crewMember.value.cardNumber,
                testRatingId: a.isTesting ? state.testRating : option.none
            });
        })
    }
}



function validateSubmit(state: MemberActionState): string[]{
    return [];
}

function CreateQueueSignout(props: {state: MemberActionState, setState: React.Dispatch<React.SetStateAction<MemberActionState>>}){
    const asc = React.useContext(AppStateContext);
    const cache = React.useContext(ScannedPersonsCacheContext);
    const modal = React.useContext(ModalContext);
    return <>
        <div className="flex flex-row gap-2 mr-0 ml-auto">
            <Button className="bg-gray-300 px-5 py-2">Queue Signout</Button>
            <Button className="px-5 py-2 bg-boathouseblue text-gray-100" spinnerOnClick submit={(e) => {
                return createSignout.sendJson(asc, convertToCreateSignout(props.state, cache)).then((a) => {
                    if(a.type == "Success"){
                        modal.setOpen(false);
                    }else{
                        props.setState((s) => ({...s, dialogOutput: option.some(a.message)}))
                    }
                });
            }}>Create Signout</Button>
        </div>
    </>
}

const memberActionTypes: {title: React.ReactNode, getContent: (state: MemberActionState, setState: React.Dispatch<React.SetStateAction<MemberActionState>>) => React.ReactNode}[] = [{
    title: "Sign Out",
    getContent: (state, setState) => <>
        <EditSignout state={state} setState={setState} mode={SignoutActionMode.SIGNOUT}/>
        <CreateQueueSignout state={state} setState={setState}/>
    </>
},
{
    title: "Testing",
    getContent: (state, setState) => <>
        <EditSignout state={state} setState={setState} mode={SignoutActionMode.TESTING}/>
        <CreateQueueSignout state={state} setState={setState}/>
    </>
},
{
    title: "Classes",
    getContent: () => (<div>View ap class management for scanned person</div>)
},
{
    title: "Racing",
    getContent: (state, setState) => <>
        <EditSignout state={state} setState={setState} mode={SignoutActionMode.RACING}/>
        <CreateQueueSignout state={state} setState={setState}/>
    </>
},
{
    title: "Ratings",
    getContent: (state, setState) => (<MemberActionRatings state={state} setState={setState}></MemberActionRatings>)
},
{
    title: "Comments",
    getContent: (state, setState) => (<div>
            <AddEditCrew state={state} setState={setState} mode={SignoutActionMode.COMMENTS}></AddEditCrew>
            <textarea cols={100} rows={20}></textarea>
        </div>)
}]

export type GrantRatingsType = t.TypeOf<typeof grantRatingsValidator>

function convertToGrantRatings(state: MemberActionState, programId: number, ratingIds: number[], cache: ScannedPersonsCacheGet): GrantRatingsType{
    return {
        instructor: "jon",
        programId: programId,
        ratingIds: ratingIds,
        personIds: state.currentPeople.map((a) => cache.getCached(a.cardNum).getOrElse(d).personId)
    }
}

function MemberActionRatings(props: {state: MemberActionState, setState: React.Dispatch<React.SetStateAction<MemberActionState>>}){
    const cache = React.useContext(ScannedPersonsCacheContext);
    const asc = React.useContext(AppStateContext);
    const availablePrograms = {};
    props.state.currentPeople.forEach((a) => availablePrograms[cache.getCached(a.cardNum).getOrElse(d).activeMemberships[0].programId.getOrElse(1)] = true);
    const [programId, setProgramId] = React.useState<option.Option<number>>(option.none);
    const [selectedRatings, setSelectedRatings] = React.useState<{[key: number]: boolean}>({});
    return <div className="flex flex-col gap-5 grow-[1]">
            <AddEditCrew state={props.state} setState={props.setState} mode={SignoutActionMode.RATINGS}></AddEditCrew>
            <SelectInput controlledValue={programId} updateValue={setProgramId} selectOptions={programsHR.filter((a) => availablePrograms[a.value])} validationResults={[]} autoWidth/>
            <RatingsGrid selectedProgram={programId} selectedRatings={selectedRatings} setSelectedRatings={setSelectedRatings}></RatingsGrid>
            <Button className="px-5 py-2 bg-boathouseblue text-gray-100 ml-auto mr-0 mt-auto mb-0" spinnerOnClick submit={(e) => {
                console.log(convertToGrantRatings(props.state, programId.getOrElse(undefined), Object.keys(selectedRatings).map((a) => parseInt(a)), cache));
                return grantRatings.sendJson(asc, convertToGrantRatings(props.state, programId.getOrElse(undefined), Object.keys(selectedRatings).map((a) => parseInt(a)), cache)).then((a) => {
                    console.log(a);
                });
            }}>Grant Ratings</Button>
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
    const [state, setState] = React.useState({
        currentPeople: [{cardNum: props.scannedCard, isSkipper: true, isTesting: true, sortOrder: 0}],
        boatId: option.none,
        boatNum: option.none,
        hullNum: option.none,
        sailNum: option.none,
        signoutType: option.none,
        testType: option.none,
        testRating: option.none,
        dialogOutput: option.none});
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
            {memberActionTypes.map((a, i) => <Tab.Panel className="flex flex-col grow-[1]" key={i}>{a.getContent(state, setState, )}</Tab.Panel>)}
        </Tab.Panels>
    </Tab.Group>
}

function adaptSignoutState(state: SignoutTablesState): EditSignoutState{
	return {
		currentPeople: [{cardNum: state.cardNum.getOrElse(undefined), isSkipper: true, isTesting: state.signoutType == SignoutTypes.TEST, sortOrder: 0}].concat(state.$$crew.map((a, i) => ({cardNum: a.cardNum.getOrElse(undefined), isSkipper: false, isTesting: false, sortOrder: (i + 1)}))),
		boatId: option.some(state.boatId),
        signoutType: option.some(state.signoutType),
        boatNum: option.none,
        hullNum: state.hullNumber,
        sailNum: state.sailNumber,
        testType: state.testResult,
        testRating: state.testRatingId,
        dialogOutput: option.none
	}
}

const makeNode = (index: number, display: React.ReactNode) => (checked: boolean, setValue) => {
	return <h1 className={"flex " + (checked ? "text-boathouseblue" : "")} key={index}>{display}</h1>;
}

function EditSignoutModal(props: EditSignoutType){
    const [state, setState] = React.useState(adaptSignoutState(props.currentSignout));
    const mode = (state.signoutType.isSome() && state.signoutType.value == SignoutTypes.TEST) ? SignoutActionMode.TESTING : SignoutActionMode.SIGNOUT;
        return <>
			<ModalHeader className="font-bold text-2xl gap-1">
				<RadioGroup className="flex flex-row" value={state.signoutType} setValue={(v) => setState((s) => ({...s, signoutType: v}))} makeChildren={signoutTypesHR.map((a,i) => ({value: a.value, makeNode: (c, s) => {return makeNode(i, a.display)(c, s)}}))}/>
			</ModalHeader>
				<div className="w-[80vw] h-[80vh] p-5">
					<EditSignout state={state} setState={setState} mode={mode}/>
				</div>
			</>
}

export default function ActionModal(props: ActionModalProps){
    const modalContent = props.action.createModalContent(props.action.modeInfo);
    return (
        <Modal open={props.action && !(props.action instanceof NoneAction)} setOpen={(s) => {if(!s){props.setAction(new NoneAction())}}} className="bg-gray-100 rounded-lg">
            {modalContent}
        </Modal>);
}

export const ActionModalContext = React.createContext<ActionModalProps>({action: new NoneAction(), setAction: () => {}});

export function ActionModalProvider(props: {children?: React.ReactNode}){
    const [action, setAction] = React.useState(new NoneAction());
    return <ActionModalContext.Provider value={{action, setAction}}>
        {props.children}
        <ActionModal action={action} setAction={setAction}></ActionModal>
    </ActionModalContext.Provider>
}