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
import { SignoutActionMode, SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { MemberActionModalStateType } from "./MemberActionType";
import { buttonClassActive, buttonClasses } from '../styles';
import { CreateQueueSignout } from "./CreateQueueSignout";
import { EditSignout } from '../signouts/EditSignoutModal';
import { ActionModalPropsWithState, subStateWithSet } from '../ActionModalProps';
import ActionBasedEditor, { ActionActionType } from 'components/ActionBasedEditor';

type GetContentType = (current: SignoutCombinedType, actions: ActionActionType<SignoutCombinedType>) => React.ReactNode;

const getContentEditSignout: (mode: SignoutActionMode) => GetContentType = (mode) => (current, actions) => {
    return <>
    <EditSignout current={current} actions={actions} mode={mode} />
    <CreateQueueSignout current={current} actions={actions} />
</>
}

const memberActionTypes: { title: React.ReactNode; getContent: GetContentType }[] = [{
    title: "Sign Out",
    getContent: getContentEditSignout(SignoutActionMode.SIGNOUT)
},
{
    title: "Testing",
    getContent: getContentEditSignout(SignoutActionMode.TESTING)
},
{
    title: "Classes",
    getContent: () => (<div>View ap class management for scanned person</div>)
},
{
    title: "Racing",
    getContent: getContentEditSignout(SignoutActionMode.RACING)
},
{
    title: "Ratings",
    getContent: (current, actions) => (<MemberActionRatings current={current} actions={actions}></MemberActionRatings>)
},
{
    title: "Comments",
    getContent: (current, actions) => (<div>
        <AddEditCrew currentPeople={current.currentPeople} {...getCrewActions({current, actions, mode: SignoutActionMode.COMMENTS})} mode={SignoutActionMode.COMMENTS}></AddEditCrew>
        <textarea cols={100} rows={20}></textarea>
    </div>)
}];

export type GrantRatingsType = t.TypeOf<typeof grantRatingsValidator>;
function convertToGrantRatings(state: SignoutCombinedType, programId: number, ratingIds: number[]): GrantRatingsType {
    return {
        instructor: "jon",
        programId: programId,
        ratingIds: ratingIds,
        personIds: state.currentPeople.map((a) => a.personId)
    };
}
function MemberActionRatings(props: { current: SignoutCombinedType; actions: ActionActionType<SignoutCombinedType> }) {
    const asc = React.useContext(AppStateContext);
    const availablePrograms = {};
    props.current.currentPeople.forEach((a) => {
        (availablePrograms[a.activeMemberships[0].programId.getOrElse(1)] = true);
    });
    const [programId, setProgramId] = React.useState<option.Option<number>>(option.none);
    const [selectedRatings, setSelectedRatings] = React.useState<{ [key: number]: boolean; }>({});
    return <div className="flex flex-col gap-5 grow-[1]">
        <AddEditCrew currentPeople={props.current.currentPeople} {...getCrewActions({...props, mode: SignoutActionMode.RATINGS})} mode={SignoutActionMode.RATINGS}></AddEditCrew>
        <SelectInput controlledValue={programId} updateValue={setProgramId} selectOptions={programsHR.filter((a) => availablePrograms[a.value])} validationResults={[]} autoWidth />
        <RatingsGrid selectedProgram={programId} selectedRatings={selectedRatings} setSelectedRatings={setSelectedRatings}></RatingsGrid>
        <Button className={buttonClasses + " " + buttonClassActive + " ml-auto mr-0 mt-auto mb-0"} spinnerOnClick submit={(e) => {
            return grantRatings.sendJson(asc, convertToGrantRatings(props.current, programId.getOrElse(undefined), Object.keys(selectedRatings).map((a) => parseInt(a)))).then((a) => {
                console.log(a);
            });
        }}>Grant Ratings</Button>
    </div>;
}

export function MemberActionModal(props: ActionModalPropsWithState<SignoutCombinedType, MemberActionModalStateType>) {
    const [actions, setActions] = subStateWithSet(props.state, props.setState, 'actions');
    return <DefaultModalBody>
        <ActionBasedEditor originalData={props.info} actions={actions} setActions={setActions} makeChildren={(current, actions) => 
            <Tab.Group>
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
                        {memberActionTypes.map((a, i) => <Tab.Panel className="flex flex-col grow-[1]" key={i}>{a.getContent(current, actions)}</Tab.Panel>)}
                    </Tab.Panels>
            </Tab.Group>
        }/>
    </DefaultModalBody>;
}
