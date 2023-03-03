import ActionBasedEditor, { ActionActionType } from 'components/ActionBasedEditor';
import { Card, CardLayout, FlexSize, LayoutDirection } from 'components/dockhouse/Card';
import { ClassTypesContext } from 'async/providers/ClassTypesProvider';
import { DefaultModalBody, ModalHeader } from 'components/wrapped/Modal';
import { option } from 'fp-ts';
import { formatsById } from "pages/dockhouse/classes/formatsById";
import * as React from 'react';
import { CardNumberScanner } from '../CardNumberScanner';
import ClassRosterTable from './ClassRosterTable';
import ClassSignoutBoatList, { ClassActionsList, makeNewSignout } from './ClassSignoutBoatList';
import { SelectedType } from "./ClassSelectableDiv";
import { AddActionType, AddActionType as AddPersonToClassAction, AddCrewAction, RemoveSignouts, UpdateClass, UpdateCrewAction, UpdateSignoutAction, UpdateSignoutCrew } from './Actions';
import * as moment from 'moment';
import { ButtonStyled } from '../styles';
import { SelectInput } from 'components/wrapped/Input';
import { ClassLocationsContext } from 'async/providers/ClassLocationsProvider';
import { RatingsContext } from 'async/providers/RatingsProvider';
import { InstructorsContext } from 'async/providers/InstructorsProvider';
import { getSelectedRosterPeople, getSelectedSignoutPeople, getSelectedSignouts } from './getSelected';
import { ActionModalPropsWithState, subStateWithSet } from '../ActionModalProps';
import { Tab } from '@headlessui/react';
import { ActionClassType, ActionClassModalState } from './ActionClassType';
import { ClassesTodayContext } from 'async/providers/ClassesTodayProvider';
import { ApClassSignup, SignupType } from 'async/staff/dockhouse/ap-class-sessions';
import { ScannedPersonType } from 'async/staff/dockhouse/scan-card';
import { SignoutsTodayContext } from 'async/providers/SignoutsTodayProvider';

export const selectNone: SelectedType = {
}

export function ActionBasedEditorButtons<T_Data>(props: ActionActionType<T_Data>) {
    return <div className="flex flex-row gap-2">
        <ButtonStyled onClick={props.reset}>Reset</ButtonStyled>
        <ButtonStyled onClick={props.undo}>Undo</ButtonStyled>
    </div>
}

function SelectClassLocation(props: { currentLocation: option.Option<string> } & AddActionType) {
    const classLocations = React.useContext(ClassLocationsContext);
    return <SelectInput controlledValue={props.currentLocation} customStyle updateValue={(v) => {
        //props.addAction(updateClass({
        //    $$apClassInstance: {...}
        //}));
    }} selectOptions={classLocations.filter((a) => a.ACTIVE).map((a) => ({ value: a.LOCATION_NAME, display: a.LOCATION_NAME }))} autoWidth />;
}

export function RatingsSelect(props: { label?: React.ReactNode, className?: string, ratingId: option.Option<number>, setRating: (ratingId: option.Option<number>) => void }) {
    const ratings = React.useContext(RatingsContext);
    const ratingsHR = React.useMemo(() => ratings.map((a) => ({ value: a.ratingId, display: a.ratingName })), [ratings]);
    return <SelectInput label={props.label} className={props.className} controlledValue={props.ratingId} updateValue={props.setRating} selectOptions={ratingsHR} autoWidth />
}

export function InstructorsSelect(props: { label?: React.ReactNode, className?: string, currentInstructorId: option.Option<number>, setInstructorId: (instructorId: option.Option<number>) => void }) {
    const instructors = React.useContext(InstructorsContext);
    const instructorsHR = React.useMemo(() => instructors.map((a) => ({ value: a.INSTRUCTOR_ID, display: a.NAME_FIRST + " " + a.NAME_LAST })), [instructors]);
    return <SelectInput label={props.label} className={props.className} controlledValue={props.currentInstructorId} updateValue={props.setInstructorId} selectOptions={instructorsHR} autoWidth />
}

export function getBoatListActions(selectType, setSelectType, selected, setSelected) {
    return {
        selectType,
        setSelectType,
        selected: selected,
        add: (n) => {
            setSelected((s) => ({ ...s, ...n }));
        },
        remove: (n) => {
            setSelected((s) => Object.entries(s).filter((a) => !n[a[0]]).reduce((a, b) => {
                a[b[0]] = true;
                return a;
            }, {} as SelectedType));
        },
        set: setSelected
    }
}

function defaultClassSignup(person: ScannedPersonType, time: moment.Moment){
    return {
        instanceId: 0,
        discountInstanceId: option.none,
        voidedOnline: false,
        personId: person.personId,
        orderId: option.none,
        price: option.none,
        signupId: -1,
        $$apClassWaitlistResult: undefined,
        $$person: person,
        closeId: option.none,
        ccTransNum: option.none,
        paymentMedium: option.none,
        paymentLocation: option.none,
        voidCloseId: option.none,
        sequence: 0,
        signupType: SignupType.ACTIVE,
        signupNote: option.none,
        signupDatetime: time
    } as ApClassSignup
}

export function AddPersonScanner(props: {classSessionId: number}){
    const classes = React.useContext(ClassesTodayContext);
    return <CardNumberScanner label="" onAction={(a) => {
        classes.setState((s) => s.map((b) => {
            if(b.sessionId == props.classSessionId){
                if(b.$$apClassInstance.$$apClassSignups.some((c) => c.$$person.personId == a.personId)){
                    alert("Already in the class");
                    return b;
                }
                return {...b, $$apClassInstance: {...b.$$apClassInstance, $$apClassSignups: b.$$apClassInstance.$$apClassSignups.concat(defaultClassSignup(a, moment()))}}
            }else{
                return b;
            }
        }))
    }}></CardNumberScanner>
}

export default function ActionClassModal(props: ActionModalPropsWithState<ActionClassType, ActionClassModalState>) {

    const classTypes = React.useContext(ClassTypesContext);
    const formats = formatsById(classTypes);
    const [selected, setSelected] = subStateWithSet(props.state, props.setState, 'selected');
    const [selectType, setSelectType] = subStateWithSet(props.state, props.setState, 'selectType');
    const [currentRating, setCurrentRating] = subStateWithSet(props.state, props.setState, 'currentRating');
    const [actions, setActions] = subStateWithSet(props.state, props.setState, 'actions');
    const boatListActions = getBoatListActions(selectType, setSelectType, selected, setSelected);
    const signouts = React.useContext(SignoutsTodayContext);
    return <DefaultModalBody>
        <ActionBasedEditor originalData={props.info} actions={actions} setActions={setActions} makeChildren={(state, { addAction, undo, reset }) => <>
            {console.log(formats)}
            <ModalHeader className='font-bold text-2xl'>
                Class {formats[state.currentClass.$$apClassInstance.formatId].b.typeName} @ <SelectClassLocation currentLocation={state.currentClass.$$apClassInstance.locationString} addAction={addAction} />
            </ModalHeader>
            <CardLayout direction={LayoutDirection.HORIZONTAL} weight={FlexSize.S_5} className="min-h-0">
                <Card title="Class Roster (On Land)" weight={FlexSize.S_0} className="min-h-0 overflow-y-scroll min-w-[30%]">
                    <ClassRosterTable {...state} {...boatListActions} makeNewSignout={(boatId) => {
                                    return makeNewSignout(signouts.state, option.none, addAction);
                                }} addTo={(signoutId, person) => {
                                    addAction(new UpdateSignoutCrew([new AddCrewAction({...person, personRatings: []} as any)], signoutId))
                                }} />
                    <AddPersonScanner classSessionId={state.currentClass.sessionId}/>
                </Card>
                <Tab.Group className="min-h-0 h-full">
                    <Card title={<Tab.List>
                        <Tab>On The Water</Tab>
                        <Tab>Grant Ratings</Tab>
                    </Tab.List>} className="min-h-0 overflow-y-scroll" weight={FlexSize.S_4}>
                        <Tab.Panels className="min-h-0 h-full">
                            <Tab.Panel className="min-h-0 h-full flex flex-col">
                                <ClassSignoutBoatList {...state} {...boatListActions} setSignout={(id, key, value) => {
                                    addAction(new UpdateSignoutAction({signoutId: id, [key]: value}))
                                }} makeNewSignout={(boatId) => {
                                    return makeNewSignout(state.associatedSignouts, boatId, addAction);
                                }}/>
                                <div className="flex flex-col gap-2 mt-auto mb-0 whitespace-nowrap">
                                    <ClassActionsList signin={undefined} incident={undefined} cancel={() => {
                                        const signouts = getSelectedSignouts(state.associatedSignouts, selected);
                                        addAction(new RemoveSignouts(signouts.map((a) => a.signoutId)));
                                    }} />
                                    <ActionBasedEditorButtons addAction={addAction} undo={undo} reset={reset} />
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="mr-0 ml-auto">
                                    <RatingsSelect label="Rating: " ratingId={currentRating} setRating={setCurrentRating} />
                                </div>
                                <ButtonStyled onClick={() => {
                                    const selectedPeopleIds = getSelectedRosterPeople(state.currentClass, selected).map((a) => a.$$person.personId).concat(getSelectedSignoutPeople(state.associatedSignouts, selected).map((a) => a.personId));
                                    if (selectedPeopleIds.length == 0) {
                                        alert("Must select people to add ratings");
                                    } else if (currentRating.isNone()) {
                                        alert("Must select a rating");
                                    }
                                }}>Grant Ratings</ButtonStyled>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Card>
                </Tab.Group>
            </CardLayout>
        </>
        } />
    </DefaultModalBody>
}