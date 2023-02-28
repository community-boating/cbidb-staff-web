import ActionBasedEditor, { ActionActionType } from 'components/ActionBasedEditor';
import { Card, CardLayout, FlexSize, LayoutDirection } from 'components/dockhouse/Card';
import { ClassTypesContext } from 'async/providers/ClassTypesProvider';
import { DefaultModalBody, ModalHeader } from 'components/wrapped/Modal';
import { option } from 'fp-ts';
import { formatsById } from "pages/dockhouse/classes/formatsById";
import * as React from 'react';
import { CardNumberScanner } from '../CardNumberScanner';
import { AddInstructor, InstructorsList } from './AddEditInstructors';
import ClassRosterTable from './ClassRosterTable';
import ClassSignoutBoatList, { ClassActionsList } from './ClassSignoutBoatList';
import { SelectedType } from "./ClassSelectableDiv";
import { AddActionType, AddPersonToClassAction as AddPersonToClassAction, RemoveSignouts, UpdateClass } from './Actions';
import * as moment from 'moment';
import { Button, ButtonProps } from 'reactstrap';
import { buttonClasses, buttonClassInactive, ButtonStyled } from '../styles';
import { SelectInput } from 'components/wrapped/Input';
import { ClassLocationsContext } from 'async/providers/ClassLocationsProvider';
import { RatingsContext } from 'async/providers/RatingsProvider';
import { InstructorsContext } from 'async/providers/InstructorsProvider';
import { getSelectedRosterPeople, getSelectedSignoutPeople, getSelectedSignouts } from './getSelected';
import { ActionModalPropsWithState, getInfo, subStateWithSet } from '../ActionModalProps';
import { Tab } from '@headlessui/react';
import { ActionClassType, ActionClassModalState } from './ActionClassType';

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

export default function ActionClassModal(props: ActionModalPropsWithState<ActionClassType, ActionClassModalState>) {

    const classTypes = React.useContext(ClassTypesContext);
    const formats = formatsById(classTypes);
    const [selected, setSelected] = subStateWithSet(props.state, props.setState, 'selected');
    const [selectType, setSelectType] = subStateWithSet(props.state, props.setState, 'selectType');
    const [currentRating, setCurrentRating] = subStateWithSet(props.state, props.setState, 'currentRating');
    const [actions, setActions] = subStateWithSet(props.state, props.setState, 'actions');
    const [grantingInstructorId, setGrantingInstructorId] = React.useState<option.Option<number>>(option.none);
    const boatListActions = {
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
    return <DefaultModalBody>
        <ActionBasedEditor originalData={props.info} actions={actions} setActions={setActions} makeChildren={(state, { addAction, undo, reset }) => <>
            {console.log(formats)}
            <ModalHeader className='font-bold text-2xl'>
                Class {formats[state.currentClass.$$apClassInstance.formatId].b.typeName} @ <SelectClassLocation currentLocation={state.currentClass.$$apClassInstance.locationString} addAction={addAction} />
            </ModalHeader>
            <CardLayout direction={LayoutDirection.HORIZONTAL} weight={FlexSize.S_5} className="min-h-0">
                <Card title="Class Roster (On Land)" weight={FlexSize.S_0} className="min-h-0 overflow-y-scroll min-w-[30%]">
                    <ClassRosterTable {...state} {...boatListActions} addAction={addAction} />
                    <CardNumberScanner label="" onAction={(a) => {
                        if (state.currentClass.$$apClassInstance.$$apClassSignups.some((b) => b.personId == a.personId)) {
                            alert("Already in the class")
                        } else {
                            addAction(new AddPersonToClassAction({ ...a }, moment()))
                        }
                    }}></CardNumberScanner>
                </Card>
                <Tab.Group className="min-h-0 h-full">
                    <Card title={<Tab.List>
                        <Tab>On The Water</Tab>
                        <Tab>Grant Ratings</Tab>
                    </Tab.List>} className="min-h-0 overflow-y-scroll" weight={FlexSize.S_4}>
                        <Tab.Panels className="min-h-0 h-full">
                            <Tab.Panel className="min-h-0 h-full flex flex-col">
                                <ClassSignoutBoatList {...state} {...boatListActions} addAction={addAction} />
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
                                <div className="mr-0 ml-auto">
                                    <InstructorsSelect label="Granting: " currentInstructorId={grantingInstructorId} setInstructorId={setGrantingInstructorId} />
                                </div>
                                <div className="mr-0 ml-auto">
                                    <InstructorsSelect label="Current Instructor: " currentInstructorId={option.none} setInstructorId={(v) => {
                                        //addAction(updateClass({
                                        //    instructorId: v
                                        //}));
                                    }} />
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