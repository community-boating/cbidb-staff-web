import { Tab } from '@headlessui/react';
import { DefaultModalBody, ModalHeader } from 'components/wrapped/Modal';
import * as React from 'react';
import * as t from "io-ts";
import { option } from 'fp-ts';
import { programsHR } from '../../../../pages/dockhouse/signouts/Constants';
import Button from 'components/wrapped/Button';
import { SelectInput } from 'components/wrapped/Input';
import RatingsGrid from './RatingsGrid';
import { AppStateContext } from 'app/state/AppStateContext';
import { grantRatingsValidator, postWrapper as grantRatings } from 'async/staff/dockhouse/grant-ratings';
import { AddEditCrew, getCrewActions } from '../SkipperInfo';
import { SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { MemberActionModalStateType, MemberActionType, MemberActionMode } from "./MemberActionType";
import { buttonClassActive, buttonClasses } from '../styles';
import { CreateQueueSignout } from "./CreateQueueSignout";
import { EditSignout } from "../signouts/EditSignout";
import { ActionModalPropsWithState, subStateWithSet, subStateWithSetO } from '../ActionModalProps';
import ActionBasedEditor, { ActionActionType } from 'components/ActionBasedEditor';
import { AddPersonScanner, getBoatListActions } from '../class/ActionClassModal';
import ClassesCalendar from 'pages/dockhouse/classes/ClassesCalendar';
import { getClassInfo } from '../class/ActionClass';
import ClassRosterTable from '../class/ClassRosterTable';
import { ClassBoat } from '../class/ClassSignoutBoatList';
import { AddPersonAction, ChangeClassAction, RemovePersonByIdAction, UpdateSignoutAction } from './Actions';
import { selectKeySignout } from '../class/ClassSelectableDiv';
import { adaptPerson } from '../signouts/EditSignoutType';
import { SignoutType } from 'async/staff/dockhouse/signouts';

type GetContentType = (current: MemberActionType, actions: ActionActionType<MemberActionType>, dialogOutput: {value: option.Option<string>, setValue: React.Dispatch<React.SetStateAction<option.Option<string>>>}) => React.ReactNode;

const getContentEditSignout: (mode: MemberActionMode) => GetContentType = (mode) => (current, actions, dialogOutput) => {
    return <>
    <EditSignout current={current} actions={actions} mode={mode} dialogOutput={dialogOutput.value} />
    <CreateQueueSignout current={current} actions={actions} setDialogOutput={dialogOutput.setValue}/>
</>
}

const memberActionTypes: { title: React.ReactNode; mode: MemberActionMode, signoutType: option.Option<SignoutType>, getContent: GetContentType }[] = [{
    title: "Sign Out",
    mode: MemberActionMode.SIGNOUT,
    signoutType: option.some(SignoutType.SAIL),
    getContent: getContentEditSignout(MemberActionMode.SIGNOUT)
},
{
    title: "Testing",
    mode: MemberActionMode.TESTING,
    signoutType: option.some(SignoutType.TEST),
    getContent: getContentEditSignout(MemberActionMode.TESTING)
},
{
    title: "Classes",
    mode: MemberActionMode.CLASSES,
    signoutType: option.some(SignoutType.CLASS),
    getContent: (current, actions) => <MemberActionClasses current={current} actions={actions}/>
},
{
    title: "Racing",
    mode: MemberActionMode.RACING,
    signoutType: option.some(SignoutType.RACE),
    getContent: getContentEditSignout(MemberActionMode.RACING)
},
{
    title: "Ratings",
    mode: MemberActionMode.RATINGS,
    signoutType: option.none,
    getContent: (current, actions) => (<MemberActionRatings current={current} actions={actions}></MemberActionRatings>)
},
{
    title: "Comments",
    mode: MemberActionMode.COMMENTS,
    signoutType: option.none,
    getContent: (current, actions) => (<div>
        <AddEditCrew currentPeople={current.currentPeople} {...getCrewActions({current, actions, mode: MemberActionMode.COMMENTS})} mode={MemberActionMode.COMMENTS}></AddEditCrew>
        <textarea className="w-full" cols={100} rows={10}></textarea>
        <Button className={buttonClasses + " " + buttonClassActive + " ml-auto mr-0 mt-auto mb-0"} spinnerOnClick submit={(e) => {
            return Promise.resolve();
        }}>Save Comments</Button>
    </div>)
}];

function ClassInfo(props: {current: MemberActionType, currentClassSessionId: number, actions: ActionActionType<MemberActionType>}){
    const info = getClassInfo(props.currentClassSessionId)();
    info.associatedSignouts = [props.current];
    const [selectType, setSelectType] = React.useState({});
    const actions = getBoatListActions(selectType, setSelectType, {[selectKeySignout(props.current.signoutId)]: true}, () => {});
    return <div className="flex flex-row max-h-full">
        <div className="h-full grow-[1]">
            <ClassRosterTable {...info} {...actions} makeNewSignout={() => 0} addTo={(id, person) => {
                props.actions.addAction(new AddPersonAction(adaptPerson(person)))
            }}/>
            <AddPersonScanner classSessionId={props.currentClassSessionId}/>
        </div>
        <ClassBoat {...props.current} {...actions} setSignout={(signoutId, key, value) => {
            props.actions.addAction(new UpdateSignoutAction(key, value));
        }} isBig removePerson={(personId) => {
            props.actions.addAction(new RemovePersonByIdAction(personId));
        }}/>
    </div>
}

function MemberActionClasses(props: { current: MemberActionType; actions: ActionActionType<SignoutCombinedType>}){
    
    const setSelectedClass = (selected: option.Option<number>) => {
        props.actions.addAction(new ChangeClassAction(selected));
    }

    return <div className="h-full">
        {props.current.currentClassSessionId.isNone() ? <ClassesCalendar handleSelectClass={(s) => {setSelectedClass(option.some(s.sessionId))}}/> : <Button onClick={() => {setSelectedClass(option.none)}}>Choose Class</Button>}
        {props.current.currentClassSessionId.isSome() ? <ClassInfo current={props.current} currentClassSessionId={props.current.currentClassSessionId.value} actions={props.actions}/> : <></>}
        <CreateQueueSignout {...props} setDialogOutput={() => {}}/>
    </div>
}

export type GrantRatingsType = t.TypeOf<typeof grantRatingsValidator>;
function convertToGrantRatings(state: SignoutCombinedType, programId: number, ratingIds: number[]): GrantRatingsType {
    return {
        instructor: "jon",
        programId: programId,
        ratingIds: ratingIds,
        personIds: state.currentPeople.map((a) => a.personId)
    };
}
function MemberActionRatings(props: { current: MemberActionType; actions: ActionActionType<SignoutCombinedType>}) {
    const asc = React.useContext(AppStateContext);
    const availablePrograms = {};
    props.current.currentPeople.forEach((a) => {
        (availablePrograms[a.activeMemberships[0].programId.getOrElse(1)] = true);
    });
    const [programId, setProgramId] = React.useState<option.Option<number>>(option.none);
    const [selectedRatings, setSelectedRatings] = React.useState<{ [key: number]: boolean; }>({});
    return <div className="flex flex-col gap-5 grow-[1]">
        <AddEditCrew currentPeople={props.current.currentPeople} {...getCrewActions({...props, mode: MemberActionMode.RATINGS})} mode={MemberActionMode.RATINGS}></AddEditCrew>
        <SelectInput controlledValue={programId} updateValue={setProgramId} selectOptions={programsHR.filter((a) => availablePrograms[a.value])} validationResults={[]} autoWidth />
        <RatingsGrid selectedProgram={programId} selectedRatings={selectedRatings} setSelectedRatings={setSelectedRatings}></RatingsGrid>
        <Button className={buttonClasses + " " + buttonClassActive + " ml-auto mr-0 mt-auto mb-0"} spinnerOnClick submit={(e) => {
            return grantRatings.sendJson(asc, convertToGrantRatings(props.current, programId.getOrElse(undefined), Object.keys(selectedRatings).map((a) => parseInt(a)))).then((a) => {
                console.log(a);
            });
        }}>Grant Ratings</Button>
    </div>;
}

export function MemberActionModal(props: ActionModalPropsWithState<MemberActionType, MemberActionModalStateType>) {
    const [actions, setActions] = subStateWithSet(props.state, props.setState, 'actions');
    const dialogOutput = subStateWithSetO(props.state, props.setState, 'dialogOutput');
    return <DefaultModalBody>
        <ActionBasedEditor originalData={props.info} actions={actions} setActions={setActions} makeChildren={(current, actions) => 
            <Tab.Group selectedIndex={memberActionTypes.findIndex((a) => a.mode == props.state.mode)} onChange={(m) => {
                props.setState((s) => ({...s, mode: memberActionTypes[m].mode}));
                memberActionTypes[m].signoutType.isSome() && actions.addAction(new UpdateSignoutAction('signoutType', memberActionTypes[m].signoutType))
            }}>
                    <ModalHeader className="text-2xl font-bold">
                        <Tab.List className="flex flex-row gap-primary">
                            <h1>Member Actions:</h1>
                            {memberActionTypes.map((a, i) => <Tab key={i} as={React.Fragment}>
                                {({ selected }) => (
                                    <div className="flex flex-row gap-primary" tabIndex={-1}>
                                        {(i > 0 ? <span onClick={(e) => { e.preventDefault(); }}><h1>|</h1></span> : "")}
                                        <button className={"inline" + (selected ? " text-boathouseblue font-bold" : " underline")}>{a.title}</button>
                                    </div>
                                )}
                            </Tab>)}
                        </Tab.List>
                    </ModalHeader>
                    <Tab.Panels className="h-[80vh] min-w-[80vw] flex flex-col">
                        {memberActionTypes.map((a, i) => <Tab.Panel className="flex flex-col grow-[1]" key={i}>{a.getContent(current, actions, dialogOutput)}</Tab.Panel>)}
                    </Tab.Panels>
            </Tab.Group>
        }/>
    </DefaultModalBody>;
}
