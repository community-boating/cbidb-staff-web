import * as React from 'react';
import { putSignout, signoutValidator } from 'async/staff/dockhouse/signouts-tables';
import TableWithModalForm, { TableWithModalFormAsync, TableWithModalFormAsyncRaw, UpdateStateType, wrapForFormComponents, wrapForFormComponentsMoment } from 'components/table/TableWithModalForm';
import { StringifiedProps } from 'util/StringifyObjectProps';
import { CustomInput as Input, SelectOption, AmPmInput, HourInput, MinuteInput, SelectInput, ValidatedTextInput } from 'components/wrapped/Input';
import { option, state } from 'fp-ts';
import * as moment from "moment";
import { SignoutsTableFilterState } from './input/SignoutsTableFilter';
import { programsHR, signoutTypesHR, testResultsHR, SignoutTablesNonEditableObject, SignoutTypes } from './Constants';
import { FilterFnOption } from '@tanstack/react-table';
import { formatSelection, formatOptional, columnsActive, columnsInactive } from "./SignoutsColumnDefs";
import { InteractiveColumnProvider } from './InteractiveColumnProvider';
import { SignoutTablesState, SignoutsTablesState, SignoutsTablesExtraState } from './StateTypes';
import { EditCrew, DialogOutput, DotBox, AddCrew, SignoutProps, SkipperInfo, MemberActionMode, AddEditCrew, EditSignoutNormal, ScannedCrewType, testMemberships } from '../memberaction/MemberActionModal';
import { ModalFoooter, ModalHeader } from 'components/wrapped/Modal';
import RadioGroup from 'components/wrapped/RadioGroup';
import BoatIcon, { BoatSelect } from '../memberaction/BoatIcon';
import { isCrewValid } from './input/EditCrewModal';
import Button from 'components/wrapped/Button';

export const filterActive = (isActive) => isActive ? (a: SignoutTablesState) => option.isNone(a.signinDatetime) : (a: SignoutTablesState) => option.isSome(a.signinDatetime);

const spanClassName = "text-left whitespace-nowrap";

function adaptCrew(state: SignoutTablesState): ScannedCrewType {
	const adaptedSkipper: ScannedCrewType[number] = state.$$skipper ? {
		personId: state.$$skipper.personId,
		cardNumber: state.cardNum.getOrElse(undefined),
		nameFirst: state.$$skipper.nameFirst,
		nameLast: state.$$skipper.nameLast,
		bannerComment: state.comments,//TODO change this when the new comments structure is figured out
		specialNeeds: option.none,    //TODO
		activeMemberships: [{
			assignId: 0,
			membershipTypeId: 0,
			startDate: option.none,
			expirationDate: option.none,
			discountName: option.none,
			isDiscountFrozen: false,
			hasGuestPrivs: false,
			programId: state.programId
		}],							  //TODO
		personRatings: state.$$skipper.$$personRatings.map((a) => ({...a, status: "Y", ratingName: ""}))
	} : undefined;
	return [adaptedSkipper];
}

function adaptSignoutState(state: SignoutTablesState): SignoutProps["state"]{
	const newCrew = adaptCrew(state);
	return {
		crew: newCrew,
		currentSkipper: 0,
		currentTesting: [],
		boatId: option.some(state.boatId)
	}
}

export function SignoutStateAdapter(props: {makeChildren: (props: SignoutProps) => React.ReactNode, state: SignoutTablesState, setState: UpdateStateType}){
	const [adaptedState, setAdaptedStateR] = React.useState(adaptSignoutState(props.state));
	const setAdaptedState = (s) => { setAdaptedStateR(s);}
	React.useEffect(() => {
		setAdaptedState(adaptSignoutState(props.state));
	}, [props.state]);
	//const setState = (scannedState: SignoutProps["state"]) => {
	//	props.setState("boatId", scannedState.boatId.getOrElse(-1).toString());
	//}
	const children = React.useMemo(() => {return props.makeChildren({state: adaptedState, setState: setAdaptedState})}, [adaptedState]);
	return <>{children}</>;
}

const makeNode = (index: number, display: React.ReactNode) => (checked: boolean, setValue) => {
	return <h1 className="flex" key={index}>{display}</h1>;
}

function BasicInput(props: {label: string}){
	return <Input groupClassName="mt-0 mb-auto ml-auto mr-0 whitespace-nowrap grow-[0]" label={props.label}></Input>
}

/*
<div className="flex flex-col h-full gap-5">
						<div className="flex flex-row grow-[0] gap-5">
							<SkipperInfo {...props}></SkipperInfo>
							<AddEditCrew state={props.state} setState={props.setState} mode={MemberActionMode.SIGNOUT}></AddEditCrew>
						</div>
						<div className="flex flex-row grow-[1]">
							<DialogOutput>
								<p>Dialog Output</p>
							</DialogOutput>
						</div>
						<div className="flex flex-row grow-[3]">
							<div className="w-full flex flex-col">
								<p>Boat Type</p>
								<BoatIcon boatId={boatId} setBoatId={setBoatId}/>
								<DotBox className="grow-[1] flex flex-row">
									<div className="flex">
										<BoatSelect boatId={boatId} setBoatId={setBoatId}></BoatSelect>
									</div>
									<div className="flex flex-col">
										<BasicInput label="Boat Number"/>
										<BasicInput label="Sail Number"/>
										<BasicInput label="Hull Number"/>
									</div>
									<div className="flex">
										<ValidatedSelectInput initValue={option.some(rowForEdit.signoutType)} updateValue={(v) => {updateState("signoutType", v.getOrElse(""))}} selectOptions={signoutTypesHR} validationResults={[]}/>
									</div>
								</DotBox>
							</div>
						</div>
					</div>
					*/

export const SignoutsTable = (props: {
	state: SignoutsTablesState;
	setState: React.Dispatch<React.SetStateAction<SignoutsTablesState>>;
	extraState: SignoutsTablesExtraState;
	isActive: boolean;
	filterValue: SignoutsTableFilterState;
	globalFilter: FilterFnOption<SignoutTablesState>;
}) => {
	const ratingsHR = React.useMemo(() => props.extraState.ratings.sort((a, b) => a.ratingName.localeCompare(b.ratingName)).map((v) => ({ value: v.ratingId, display: v.ratingName, boats: v.$$boats })), [props.extraState.ratings]);
	// Define edit/add form
	const formComponents = (
		rowForEdit: SignoutTablesState,
		updateState: UpdateStateType,
	) => {
		const currentRow = rowForEdit;
		const lower = moment("2000", "yyyy");
		const upper = moment("2032", "yyyy").add(1, "days");
		const boatId = option.none;//option.some(parseInt(rowForEdit.boatId));
		const setBoatId = (id: option.Option<number>) => {
			updateState("boatId", id.getOrElse(-1).toString());
		}
		const signoutType = rowForEdit.signoutType;
		return <>
			<ModalHeader>
				<RadioGroup className="flex flex-row" value={option.some(currentRow.signoutType) } setValue={(v) => updateState("signoutType", v.getOrElse(""))} makeChildren={signoutTypesHR.map((a,i) => ({value: a.value, makeNode: makeNode(i, a.display)}))}/>
			</ModalHeader>
			<SignoutStateAdapter state={currentRow} setState={updateState} makeChildren={
				(props) => (<div className="w-[80vw] h-[80vh] p-5">
					<EditSignoutNormal {...props}/>
				</div>)}/>
			</>
			
	};
	const footer = (submit, closeModal) => <ModalFoooter>
		<div className="flex flex-row gap-2 mr-0 ml-auto">
			<Button className="bg-gray-300 px-5 py-2" onClick={() => {closeModal()}}>Cancel</Button>
			<Button className="bg-blue-300 px-5 py-2" spinnerOnClick submit={submit}>Save</Button>
		</div>
	</ModalFoooter>
	const cardTitle = props.isActive ? "Active Signouts" : "Completed Signouts";
	const f = filterActive(props.isActive);
	const provider = React.useMemo(() => (new InteractiveColumnProvider(props.isActive ? columnsActive : columnsInactive)), [])
	var columns = React.useMemo(() => (provider.provideColumns(props.extraState)), [props.extraState]);
	const filteredSignouts = props.state.filter(f);
	return <>
		<TableWithModalFormAsyncRaw<SignoutTablesState, typeof signoutValidator, SignoutsTableFilterState>
			defaultRowEdit={{} as any}
			globalFilter={props.globalFilter}
			globalFilterState={props.filterValue}
			validator={signoutValidator}
			className="bg-white"
			rows={filteredSignouts}
			keyField="signoutId"
			columns={columns}
			formComponents={formComponents}
			action={putSignout}
			cardTitle={cardTitle}
			columnsNonEditable={SignoutTablesNonEditableObject}
			setRowData={props.setState}
			hidableColumns
			hideAdd
			customFooter={footer}
			customHeader
			/>
	</>;
};

export const ValidatedTimeInput: (props: { rowForEdit: any, updateState: UpdateStateType, validationResults, columnId: string, lower: moment.Moment, upper: moment.Moment }) => JSX.Element = (props) => {
	return <>
		<div>
			<HourInput {...wrapForFormComponentsMoment(props.rowForEdit, props.updateState, props.columnId, props.validationResults)} lower={props.lower} upper={props.upper} />
		</div>
		<div>
			<MinuteInput {...wrapForFormComponentsMoment(props.rowForEdit, props.updateState, props.columnId, props.validationResults)} lower={props.lower} upper={props.upper} />
		</div>
		<div>
			<AmPmInput {...wrapForFormComponentsMoment(props.rowForEdit, props.updateState, props.columnId, props.validationResults)} lower={props.lower} upper={props.upper} />
		</div>
	</>;
}