import { Tab } from '@headlessui/react';
import { DefaultModalBody, ModalHeader } from 'components/wrapped/Modal';
import * as React from 'react';
import * as t from "io-ts";
import { option } from 'fp-ts';
import { programsHR } from '../../../../pages/dockhouse/signouts/Constants';
import Button from 'components/wrapped/Button';
import { SelectInput } from 'components/wrapped/Input';
import RatingsGrid from '../RatingsGrid';
import { AppStateContext } from 'app/state/AppStateContext';
import { grantRatingsValidator, postWrapper as grantRatings } from 'async/staff/dockhouse/grant-ratings';
import { AddEditCrew, getCrewActions } from '../SkipperInfo';
import { SignoutActionMode, SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { MemberActionType } from "./MemberActionType";
import { buttonClassActive, buttonClasses } from '../styles';
import { CreateQueueSignout } from "../signouts/CreateQueueSignout";
import { EditSignout } from '../signouts/EditSignoutModal';
import { ActionModalPropsWithState } from '../ActionModalProps';

const memberActionTypes: { title: React.ReactNode; getContent: (state: SignoutCombinedType, setState: React.Dispatch<React.SetStateAction<SignoutCombinedType>>) => React.ReactNode; }[] = [{
    title: "Sign Out",
    getContent: (state, setState) => <>
        <EditSignout state={state} setState={setState} mode={SignoutActionMode.SIGNOUT} />
        <CreateQueueSignout state={state} setState={setState} />
    </>
},
{
    title: "Testing",
    getContent: (state, setState) => <>
        <EditSignout state={state} setState={setState} mode={SignoutActionMode.TESTING} />
        <CreateQueueSignout state={state} setState={setState} />
    </>
},
{
    title: "Classes",
    getContent: () => (<div>View ap class management for scanned person</div>)
},
{
    title: "Racing",
    getContent: (state, setState) => <>
        <EditSignout state={state} setState={setState} mode={SignoutActionMode.RACING} />
        <CreateQueueSignout state={state} setState={setState} />
    </>
},
{
    title: "Ratings",
    getContent: (state, setState) => (<MemberActionRatings state={state} setState={setState}></MemberActionRatings>)
},
{
    title: "Comments",
    getContent: (state, setState) => (<div>
        <AddEditCrew currentPeople={state.currentPeople} {...getCrewActions({state, setState, mode: SignoutActionMode.COMMENTS})} mode={SignoutActionMode.COMMENTS}></AddEditCrew>
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
function MemberActionRatings(props: { state: SignoutCombinedType; setState: React.Dispatch<React.SetStateAction<SignoutCombinedType>>; }) {
    const asc = React.useContext(AppStateContext);
    const availablePrograms = {};
    props.state.currentPeople.forEach((a) => {
        (availablePrograms[a.activeMemberships[0].programId.getOrElse(1)] = true);
    });
    const [programId, setProgramId] = React.useState<option.Option<number>>(option.none);
    const [selectedRatings, setSelectedRatings] = React.useState<{ [key: number]: boolean; }>({});
    return <div className="flex flex-col gap-5 grow-[1]">
        <AddEditCrew currentPeople={props.state.currentPeople} {...getCrewActions({...props, mode: SignoutActionMode.RATINGS})} mode={SignoutActionMode.RATINGS}></AddEditCrew>
        <SelectInput controlledValue={programId} updateValue={setProgramId} selectOptions={programsHR.filter((a) => availablePrograms[a.value])} validationResults={[]} autoWidth />
        <RatingsGrid selectedProgram={programId} selectedRatings={selectedRatings} setSelectedRatings={setSelectedRatings}></RatingsGrid>
        <Button className={buttonClasses + " " + buttonClassActive + " ml-auto mr-0 mt-auto mb-0"} spinnerOnClick submit={(e) => {
            console.log(convertToGrantRatings(props.state, programId.getOrElse(undefined), Object.keys(selectedRatings).map((a) => parseInt(a))));
            return grantRatings.sendJson(asc, convertToGrantRatings(props.state, programId.getOrElse(undefined), Object.keys(selectedRatings).map((a) => parseInt(a)))).then((a) => {
                console.log(a);
            });
        }}>Grant Ratings</Button>
    </div>;
}

export function MemberActionModal(props: ActionModalPropsWithState<MemberActionType, SignoutCombinedType>) {
    return <DefaultModalBody>
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
                    {memberActionTypes.map((a, i) => <Tab.Panel className="flex flex-col grow-[1]" key={i}>{a.getContent(props.state, props.setState)}</Tab.Panel>)}
                </Tab.Panels>
        </Tab.Group>
    </DefaultModalBody>;
}
