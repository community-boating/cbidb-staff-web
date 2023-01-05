import * as React from 'react';
import { putSignout, signoutValidator } from 'async/staff/dockhouse/signouts-tables';
import ReportWithModalForm, { UpdateStateType, wrapForFormComponents, wrapForFormComponentsMoment } from 'components/ReportWithModalForm';
import { StringifiedProps } from 'util/StringifyObjectProps';
import { Input, SelectOption, ValidatedAmPmInput, ValidatedHourInput, ValidatedMinuteInput, ValidatedSelectInput, ValidatedTextInput } from 'components/wrapped/Input';
import { option, state } from 'fp-ts';
import * as moment from "moment";
import { SignoutsTableFilterState } from './input/SignoutsTableFilter';
import { programsHR, signoutTypesHR, testResultsHR, SignoutTablesNonEditableObject, SignoutTypes } from './Constants';
import { FilterFnOption } from '@tanstack/react-table';
import { formatSelection, formatOptional, columnsActive, columnsInactive } from "./SignoutsColumnDefs";
import { InteractiveColumnProvider } from './InteractiveColumnProvider';
import { SignoutTablesState, SignoutsTablesState, SignoutsTablesExtraState } from './StateTypes';
import { adaptPerson, EditCrew, DialogOutput, DotBox, AddCrew, SignoutProps, SkipperInfo, AddCrewMode } from '../memberaction/MemberActionModal';
import { ModalFoooter, ModalHeader } from 'components/wrapped/Modal';
import RadioGroup from 'components/wrapped/RadioGroup';
import { Button } from 'reactstrap';
import BoatIcon, { BoatSelect } from '../memberaction/BoatIcon';
import { isCrewValid } from './input/EditCrewModal';

export const filterActive = (isActive) => isActive ? (a: SignoutTablesState) => option.isNone(a.signinDatetime) : (a: SignoutTablesState) => option.isSome(a.signinDatetime);

const spanClassName = "text-left whitespace-nowrap";

function adaptSignoutState(state: SignoutTablesState): SignoutProps["state"]{
	const newCrew = [adaptPerson(state.$$skipper)].concat(state.$$crew.map((a) => adaptPerson({...a, personId: a.personId.getOrElse(0), cardNumber: a.cardNum.getOrElse("")})))
	return {
		crew: newCrew,
		currentSkipper: 0,
		boatId: option.some(state.boatId)
	}
}

export function SignoutStateAdapter(props: {makeChildren: (props: SignoutProps) => React.ReactNode, state: SignoutTablesState, setState: UpdateStateType}){
	const [adaptedState, setAdaptedState] = React.useState(adaptSignoutState(props.state));
	React.useEffect(() => {
		setAdaptedState(adaptSignoutState(props.state));
	}, [props.state]);
	const setState = (scannedState: SignoutProps["state"]) => {
		props.setState("boatId", scannedState.boatId.getOrElse(-1).toString());
	}
	return <>{props.makeChildren({state: adaptedState, setState: setAdaptedState})}</>;
}

const makeNode = (index: number, display: React.ReactNode) => (checked: boolean, setValue) => {
	return <h1 className="flex" key={index}>{display}</h1>;
}

function BasicInput(props: {label: string}){
	return <Input groupClassName="mt-0 mb-auto ml-auto mr-0 whitespace-nowrap grow-[0]" label={props.label}></Input>
}

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
		rowForEdit: StringifiedProps<SignoutTablesState>,
		updateState: UpdateStateType,
		currentRow: SignoutTablesState,
		validationResults: string[]
	) => {
		const lower = moment("2000", "yyyy");
		const upper = moment("2032", "yyyy").add(1, "days");
		const boatId = option.some(parseInt(rowForEdit.boatId));
		const setBoatId = (id: option.Option<number>) => {
			updateState("boatId", id.getOrElse(-1).toString());
		}
		const signoutType = rowForEdit.signoutType;
		return <>
			<ModalHeader>
				<RadioGroup className="flex flex-row" value={option.some(currentRow.signoutType) } setValue={(v) => updateState("signoutType", v.getOrElse(""))} children={signoutTypesHR.map((a,i) => ({value: a.value, makeNode: makeNode(i, a.display)}))}/>
			</ModalHeader>
			<SignoutStateAdapter state={currentRow} setState={updateState} makeChildren={
				(props) => (<div className="w-[80vw] h-[80vh] p-5">
					<div className="flex flex-col h-full">
						<div className="flex flex-row grow-[1] gap-5">
							<SkipperInfo {...props}></SkipperInfo>
							<AddCrew {...props} mode={AddCrewMode.SIGNOUT}></AddCrew>
							<EditCrew {...props}></EditCrew>
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
				</div>)}/>
			</>
			
	};
	const footer = (submit, closeModal) => <ModalFoooter>
		<div className="flex flex-row gap-2 mr-0 ml-auto">
			<Button className="bg-gray-300 px-5 py-2" onClick={() => {closeModal()}}>Cancel</Button>
			<Button className="bg-blue-300 px-5 py-2" onClick={() => {submit()}}>Save</Button>
		</div>
	</ModalFoooter>
	const cardTitle = props.isActive ? "Active Signouts" : "Completed Signouts";
	const f = filterActive(props.isActive);
	const provider = React.useMemo(() => (new InteractiveColumnProvider(props.isActive ? columnsActive : columnsInactive)), [])
	var columns = React.useMemo(() => (provider.provideColumns(props.extraState)), [props.extraState]);
	const filteredSignouts = props.state.filter(f);

	return <>
		<ReportWithModalForm<any, typeof signoutValidator, SignoutsTableFilterState, SignoutTablesState>
			globalFilter={props.globalFilter}
			globalFilterState={props.filterValue}
			rowValidator={signoutValidator}
			className="bg-white"
			rows={filteredSignouts}
			primaryKey="signoutId"
			columns={columns}
			formComponents={formComponents}
			submitRow={putSignout}
			cardTitle={cardTitle}
			columnsNonEditable={SignoutTablesNonEditableObject}
			setRowData={props.setState}
			hidableColumns
			hideAdd
			customFooter={footer}
			customHeader
			validateSubmit={(rowForEdit, currentRow) => {
				return isCrewValid(currentRow.$$crew, Number(rowForEdit.boatId), props.extraState.boatTypes, false) || [];
			}} />
	</>;
};

export const ValidatedTimeInput: (props: { rowForEdit: any, updateState: UpdateStateType, validationResults, columnId: string, lower: moment.Moment, upper: moment.Moment }) => JSX.Element = (props) => {
	return <>
		<div>
			<ValidatedHourInput {...wrapForFormComponentsMoment(props.rowForEdit, props.updateState, props.columnId, props.validationResults)} lower={props.lower} upper={props.upper} />
		</div>
		<div>
			<ValidatedMinuteInput {...wrapForFormComponentsMoment(props.rowForEdit, props.updateState, props.columnId, props.validationResults)} lower={props.lower} upper={props.upper} />
		</div>
		<div>
			<ValidatedAmPmInput {...wrapForFormComponentsMoment(props.rowForEdit, props.updateState, props.columnId, props.validationResults)} lower={props.lower} upper={props.upper} />
		</div>
	</>;
}