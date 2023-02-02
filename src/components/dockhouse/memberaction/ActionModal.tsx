import { Tab } from '@headlessui/react';
import Modal, { ModalContext, ModalHeader } from 'components/wrapped/Modal';
import * as React from 'react';

import * as t from "io-ts";

import { option } from 'fp-ts';
import { programsHR, signoutTypesHR, testResultsHR } from '../../../pages/dockhouse/signouts/Constants';
import Button from 'components/wrapped/Button';
import { OptionalStringInput, SelectInput } from 'components/wrapped/Input';

import BoatIcon, { BoatSelect } from './BoatIcon';
import RatingsGrid from './RatingsGrid';
import { EditSignoutType } from '../../../pages/dockhouse/signouts/StateTypes';
import RadioGroup from 'components/wrapped/RadioGroup';
import { AppStateContext } from 'app/state/AppStateContext';
import { CreateSignoutType, postWrapper as createSignout } from 'async/staff/dockhouse/create-signout';
import { grantRatingsValidator, postWrapper as grantRatings } from 'async/staff/dockhouse/grant-ratings';
import { AddEditCrew, DetailedPersonInfo } from './SkipperInfo';
import { SignoutActionMode, MemberActionState, EditSignoutState } from './MemberActionState';
import { putSignout, SignoutTablesState, SignoutType } from 'async/staff/dockhouse/signouts';
import { RatingsContext } from 'components/dockhouse/providers/RatingsProvider';
import { ActionModalProps, NoneAction } from './ActionModalProps';
import { MemberActionType } from "./MemberActionType";
import { RatingsType } from 'async/staff/dockhouse/ratings';
import * as moment from 'moment';
import { buttonClassActive, buttonClasses, buttonClassInactive } from './styles';
//import { buttonClasses, buttonClassInactive, buttonClassActive } from './buttonClasses';

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
            {props.state.currentPeople.map((a, i) => (<DetailedPersonInfo key={a.personId} {...propsSorted} index={i}/>))}
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
                            <BoatSelect boatId={props.state.boatId} setBoatId={setBoatId} autoWidth nowrap></BoatSelect>
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

export function getSkipper(state: MemberActionState){
    const skipperPeople = state.currentPeople.find((a) => a.isSkipper);
    return skipperPeople ? option.some(skipperPeople) : option.none;
}

function convertToCreateSignout(state: MemberActionState): CreateSignoutType{
    const skipper = getSkipper(state);
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
        isRacing: state.signoutType.getOrElse(undefined) == "R",
        dockmasterOverride: false,
        didInformKayakRules: true,
        signoutCrew: state.currentPeople.filter((a) => !a.isSkipper).map((a) => {
            return ({
                personId: a.personId,
                cardNumber: a.cardNumber,
                testRatingId: a.testRatingId
            });
        })
    }
}

function validateSubmit(state: MemberActionState): string[]{
    return [];
}

function CreateQueueSignout(props: {state: MemberActionState, setState: React.Dispatch<React.SetStateAction<MemberActionState>>}){
    const asc = React.useContext(AppStateContext);
    const modal = React.useContext(ModalContext);
    return <>
        <div className="flex flex-row gap-2 mr-0 ml-auto">
            <Button className={buttonClasses + " " + buttonClassInactive}>Queue Signout</Button>
            <Button className={buttonClasses + " " + buttonClassActive} spinnerOnClick submit={(e) => {
                return createSignout.sendJson(asc, convertToCreateSignout(props.state)).then((a) => {
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

function convertToGrantRatings(state: MemberActionState, programId: number, ratingIds: number[]): GrantRatingsType{
    return {
        instructor: "jon",
        programId: programId,
        ratingIds: ratingIds,
        personIds: state.currentPeople.map((a) => a.personId)
    }
}

function MemberActionRatings(props: {state: MemberActionState, setState: React.Dispatch<React.SetStateAction<MemberActionState>>}){
    const asc = React.useContext(AppStateContext);
    const availablePrograms = {};
    props.state.currentPeople.forEach((a) => {
        (availablePrograms[a.activeMemberships[0].programId.getOrElse(1)] = true);
    });
    const [programId, setProgramId] = React.useState<option.Option<number>>(option.none);
    const [selectedRatings, setSelectedRatings] = React.useState<{[key: number]: boolean}>({});
    return <div className="flex flex-col gap-5 grow-[1]">
            <AddEditCrew state={props.state} setState={props.setState} mode={SignoutActionMode.RATINGS}></AddEditCrew>
            <SelectInput controlledValue={programId} updateValue={setProgramId} selectOptions={programsHR.filter((a) => availablePrograms[a.value])} validationResults={[]} autoWidth/>
            <RatingsGrid selectedProgram={programId} selectedRatings={selectedRatings} setSelectedRatings={setSelectedRatings}></RatingsGrid>
            <Button className={buttonClasses + " " + buttonClassActive + " ml-auto mr-0 mt-auto mb-0"} spinnerOnClick submit={(e) => {
                console.log(convertToGrantRatings(props.state, programId.getOrElse(undefined), Object.keys(selectedRatings).map((a) => parseInt(a))));
                return grantRatings.sendJson(asc, convertToGrantRatings(props.state, programId.getOrElse(undefined), Object.keys(selectedRatings).map((a) => parseInt(a)))).then((a) => {
                    console.log(a);
                });
            }}>Grant Ratings</Button>
        </div>
}

export function MemberActionModal(props: MemberActionType){
    const [state, setState] = React.useState({
        currentPeople: [{...props.scannedPerson, isSkipper: true, isTesting: true, testRatingId: option.none, sortOrder: 0}],
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
        <Tab.Panels className="h-[80vh] min-w-[80vw] flex flex-col">
            {memberActionTypes.map((a, i) => <Tab.Panel className="flex flex-col grow-[1]" key={i}>{a.getContent(state, setState, )}</Tab.Panel>)}
        </Tab.Panels>
    </Tab.Group>
}

function adaptSignoutState(state: SignoutTablesState, ratings: RatingsType): EditSignoutState{
	return {
		currentPeople: [{
            personId: state.$$skipper.personId,
            cardNumber: state.cardNum.getOrElse(undefined),
            nameFirst: state.$$skipper.nameFirst,
            nameLast: state.$$skipper.nameLast,
            bannerComment: state.comments,
            specialNeeds: option.none,
            personRatings: state.$$skipper.$$personRatings.map((a) => ({...a, ratingName: ratings.find((b) => b.ratingId == a.ratingId).ratingName, status: ""})),
            isSkipper: true,
            isTesting: state.signoutType == SignoutType.TEST,
            testRatingId: state.testRatingId,
            activeMemberships: [{
                assignId: 0,
                membershipTypeId: 0,
                startDate: option.some(moment()),
                expirationDate: option.none,
                discountName: option.none,
                isDiscountFrozen: false,
                hasGuestPrivs: true,
                programId: option.some(state.programId)
            }],
            sortOrder: 0}].concat((state.$$crew.map((a, i) => ({
                personId: a.$$person.personId,
                cardNumber: a.cardNum.getOrElse(undefined),
                nameFirst: a.$$person.nameFirst,
                nameLast: a.$$person.nameLast,
                bannerComment: option.none,
                specialNeeds: option.none,
                personRatings: [],
                isSkipper: false,
                isTesting: state.signoutType == SignoutType.TEST,
                testRatingId: state.testRatingId,
                activeMemberships: [{
                    assignId: 0,
                    membershipTypeId: 0,
                    startDate: option.some(moment()),
                    expirationDate: option.none,
                    discountName: option.none,
                    isDiscountFrozen: false,
                    hasGuestPrivs: true,
                    programId: option.some(state.programId)
                }],
                sortOrder: 1 + i
            })))),
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

function adaptMemberState(state: MemberActionState, currentRow: SignoutTablesState): SignoutTablesState{
    return {...currentRow,
        boatId:state.boatId.getOrElse(undefined),
        hullNumber: state.hullNum,
        sailNumber: state.hullNum,
        //$$skipper: state.currentPeople
    }
}

const makeNode = (index: number, display: React.ReactNode) => (checked: boolean, setValue) => {
	return <h1 className={"flex " + (checked ? "text-boathouseblue" : "")} key={index}>{display}</h1>;
}

export function EditSignoutModal(props: EditSignoutType){
    const ratings = React.useContext(RatingsContext);
    const [state, setState] = React.useState(adaptSignoutState(props.currentSignout, ratings));
    React.useEffect(() => {
        setState(adaptSignoutState(props.currentSignout, ratings));
    }, [props.currentSignout]);
    const mode = (state.signoutType.isSome() && state.signoutType.value == SignoutType.TEST) ? SignoutActionMode.TESTING : SignoutActionMode.SIGNOUT;
        return <>
            <ModalHeader className="font-bold text-2xl gap-1">
                <RadioGroup className="flex flex-row" value={state.signoutType} setValue={(v) => setState((s) => ({...s, signoutType: v}))} makeChildren={signoutTypesHR.map((a,i) => ({value: a.value, makeNode: (c, s) => {return makeNode(i, a.display)(c, s)}}))}/>
            </ModalHeader>
            <div className="w-[80vw] h-[80vh] p-5">
                <EditSignout state={state} setState={setState} mode={mode}/>
            </div>
            <SubmitEditSignout state={state} currentRow={props.currentSignout}/>
		</>
}

function SubmitEditSignout(props: {state: MemberActionState, currentRow: SignoutTablesState}){
    const asc = React.useContext(AppStateContext);
    return <div className="flex flex-row gap-2 ml-auto mr-0">
        <ModalContext.Consumer>
            {(value) => {
            return <Button className={buttonClasses + " " + buttonClassInactive} onClick={(e) => {
                value.setOpen(false);
                }}>Cancel</Button>
            }}
        </ModalContext.Consumer>
        <Button className={buttonClasses + " " + buttonClassActive} onClick={(e) => {
            const adaptedToSignout = adaptMemberState(props.state, props.currentRow);
            return putSignout.sendJson(asc, adaptedToSignout).then((a) => {
                console.log(a);
            });
        }}>Save</Button>
    </div>
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