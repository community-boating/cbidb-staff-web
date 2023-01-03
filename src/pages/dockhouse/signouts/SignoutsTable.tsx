import * as React from 'react';
import { putSignout, signoutValidator } from 'async/staff/dockhouse/signouts-tables';
import ReportWithModalForm, { UpdateStateType, wrapForFormComponents, wrapForFormComponentsMoment } from 'components/ReportWithModalForm';
import { StringifiedProps } from 'util/StringifyObjectProps';
import { ValidatedAmPmInput, ValidatedHourInput, ValidatedMinuteInput, ValidatedSelectInput, ValidatedTextInput } from 'components/wrapped/Input';
import { option } from 'fp-ts';
import * as moment from "moment";
import { SignoutsTableFilterState } from './input/SignoutsTableFilter';
import { programsHR, signoutTypesHR, testResultsHR, SignoutTablesNonEditableObject, SignoutTypes } from './Constants';
import { FilterFnOption } from '@tanstack/react-table';
import { formatSelection, formatOptional, columnsActive, columnsInactive } from "./SignoutsColumnDefs";
import { InteractiveColumnProvider } from './InteractiveColumnProvider';
import { SignoutTablesState, SignoutsTablesState, SignoutsTablesExtraState } from './StateTypes';

export const filterActive = (isActive) => isActive ? (a: SignoutTablesState) => option.isNone(a.signinDatetime) : (a: SignoutTablesState) => option.isSome(a.signinDatetime);

const spanClassName = "text-left whitespace-nowrap";

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
		return <>
			<div className="flex flex-col">
				<div>
						<ValidatedSelectInput {...wrapForFormComponents(rowForEdit, (id, value) => {
							updateState([id, "testRatingId"], [value, ""]);
						}, "boatId", validationResults)} selectOptions={props.extraState.boatTypesHR} showNone={{value: "", display: "None"}} label="Boat Type" />
				</div>
				<div>
					<span className={spanClassName}>
						Card # {rowForEdit.cardNum || "(none)"}
					</span>
				</div>
				<div>
					<span className={spanClassName}>
						{formatSelection(currentRow.programId, programsHR) || "(none)"}
					</span>
				</div>
				<div>
					<span className={spanClassName}>
						{formatOptional((currentRow.$$skipper || {}).nameFirst) || "(none)"}
					</span>
				</div>
				<div>
						<div className={spanClassName}>
							{formatOptional((currentRow.$$skipper || {}).nameLast) || "(none)"}
						</div>
				</div>
				<div>
						<div className={spanClassName}>
							{formatOptional((currentRow || {}).signoutDatetime) || "(none)"}
						</div>
				</div>
				<div>
						<div className={spanClassName}>
							{formatOptional((currentRow || {}).signinDatetime) || "(none)"}
						</div>
				</div>
				<div>
						<ValidatedSelectInput {...wrapForFormComponents(rowForEdit, (id, value) => {
							if (value != SignoutTypes.TEST) {
								updateState([id, "testRatingId", "testResult"], [value, "", ""]);
							} else {
								updateState(id, value);
							}
						}, "signoutType", validationResults)} selectOptions={signoutTypesHR} showNone={{value: "", display: "None"}} />
				</div>
				<div>
						<ValidatedTextInput type="text" {...wrapForFormComponents(rowForEdit, updateState, "sailNumber", validationResults)} />
				</div>
				<div>
						<ValidatedSelectInput {...wrapForFormComponents(rowForEdit, (id, value) => {
							updateState([id, "signoutType"], [value, SignoutTypes.TEST]);
						}, "testRatingId", validationResults)} selectOptions={ratingsHR/*.filter((a) => a.boats.find((b) => b.boatId == Number(rowForEdit.boatId)) !== undefined)*/} showNone={{value: "", display: "None"}} selectNone={true} />
				</div>
				<div>
						<ValidatedSelectInput {...wrapForFormComponents(rowForEdit, updateState, "testResult", validationResults)} selectOptions={testResultsHR} showNone={{value: "", display: "None"}}selectNone={true} disabled={rowForEdit.signoutType != "T"} />
				</div>
				<div>
					<ValidatedTimeInput rowForEdit={rowForEdit} updateState={updateState} columnId="signoutDatetime" validationResults={validationResults} upper={upper} lower={lower} />
				</div>
				<div>
					<ValidatedTimeInput rowForEdit={rowForEdit} updateState={updateState} columnId="signinDatetime" validationResults={validationResults} upper={upper} lower={moment(rowForEdit.signoutDatetime)} />
				</div>
			</div>
		</>;
	};
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
			rows={filteredSignouts}
			primaryKey="signoutId"
			columns={columns}
			formComponents={formComponents}
			submitRow={putSignout}
			cardTitle={cardTitle}
			columnsNonEditable={SignoutTablesNonEditableObject}
			setRowData={props.setState}
			hidableColumns={true}
			hideAdd={true}
			/*validateSubmit={(rowForEdit, currentRow) => {
				return isCrewValid(currentRow.$$crew, Number(rowForEdit.boatId), props.extraState.boatTypes) || [];
			}}*/ />
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