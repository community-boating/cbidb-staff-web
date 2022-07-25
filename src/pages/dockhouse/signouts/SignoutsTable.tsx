import * as React from 'react';
import { Col, FormGroup, Label } from 'reactstrap';
import { putSignout, signoutValidator } from 'async/rest/signouts-tables';
import ReportWithModalForm, { UpdateStateType, validationError } from 'components/ReportWithModalForm';
import { StringifiedProps } from 'util/StringifyObjectProps';
import { ValidatedSelectInput, ValidatedTextInput, wrapForFormComponents } from './input/ValidatedInput';
import { option } from 'fp-ts';
import * as moment from "moment";
import { SignoutsTableFilterState } from './input/SignoutsTableFilter';
import { programsHR, signoutTypesHR, testResultsHR, SignoutTablesNonEditableObject, SignoutTypes } from './Constants';
import { FilterFnOption } from '@tanstack/react-table';
import { SignoutsTablesState, SignoutsTablesExtraState, SignoutTablesState, ValidatedTimeInput, mapOptional, isCrewValid } from './SignoutsTablesPage';
import { formatSelection, formatOptional, columnsActive, columnsInactive } from "./SignoutsColumnDefs";

export const SignoutsTable = (props: {
	state: SignoutsTablesState;
	setState: (state: SignoutsTablesState) => void;
	extraState: SignoutsTablesExtraState;
	setExtraState: (newState: SignoutsTablesExtraState) => void;
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
		validationResults: validationError[]
	) => {
		const lower = moment("2000", "yyyy");
		const upper = moment("2032", "yyyy").add(1, "days");
		return <>
			<React.Fragment>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Boat Type
					</Label>
					<Col sm={9}>
						<ValidatedSelectInput {...wrapForFormComponents(rowForEdit, (id, value) => {
							updateState([id, "testRatingId"], [value, ""]);
						}, "boatId", validationResults)} selectOptions={props.extraState.boatTypesHR} showNone="None" />
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Card #
					</Label>
					<Col sm={9}>
						<div style={{ padding: "5px" }} className="text-left">
							{rowForEdit.cardNum || "(none)"}
						</div>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Program
					</Label>
					<Col sm={9}>
						<div style={{ padding: "5px" }} className="text-left">
							{formatSelection(currentRow.programId, programsHR) || "(none)"}
						</div>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						First Name
					</Label>
					<Col sm={9}>
						<div style={{ padding: "5px" }} className="text-left">
							{formatOptional((currentRow.$$skipper || {}).nameFirst) || "(none)"}
						</div>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Last Name
					</Label>
					<Col sm={9}>
						<div style={{ padding: "5px" }} className="text-left">
							{formatOptional((currentRow.$$skipper || {}).nameLast) || "(none)"}
						</div>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Signout Date/Time
					</Label>
					<Col sm={9}>
						<div style={{ padding: "5px" }} className="text-left">
							{formatOptional((currentRow || {}).signoutDatetime) || "(none)"}
						</div>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Signin Date/Time
					</Label>
					<Col sm={9}>
						<div style={{ padding: "5px" }} className="text-left">
							{formatOptional((currentRow || {}).signinDatetime) || "(none)"}
						</div>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Signout Type
					</Label>
					<Col sm={9}>
						<ValidatedSelectInput {...wrapForFormComponents(rowForEdit, (id, value) => {
							if (value != SignoutTypes.TEST) {
								updateState([id, "testRatingId", "testResult"], [value, "", ""]);
							} else {
								updateState(id, value);
							}
						}, "signoutType", validationResults)} selectOptions={signoutTypesHR} showNone="None" />
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Sail Number
					</Label>
					<Col sm={9}>
						<ValidatedTextInput type="text" {...wrapForFormComponents(rowForEdit, updateState, "sailNumber", validationResults)} />
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Test Rating
					</Label>
					{<Col sm={9}>
						<ValidatedSelectInput {...wrapForFormComponents(rowForEdit, (id, value) => {
							updateState([id, "signoutType"], [value, SignoutTypes.TEST]);
						}, "testRatingId", validationResults)} selectOptions={ratingsHR.filter((a) => a.boats.find((b) => b.boatId == Number(rowForEdit.boatId)) !== undefined)} showNone="None" selectNone={true} />
					</Col>}
				</FormGroup>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Test Result
					</Label>
					<Col sm={9}>
						<ValidatedSelectInput {...wrapForFormComponents(rowForEdit, updateState, "testResult", validationResults)} selectOptions={testResultsHR} showNone="None" selectNone={true} disabled={rowForEdit.signoutType != "T"} />
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Signout Time
					</Label>
					<ValidatedTimeInput rowForEdit={rowForEdit} updateState={updateState} columnId="signoutDatetime" validationResults={validationResults} upper={upper} lower={lower} />
				</FormGroup>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Signin Time
					</Label>
					<ValidatedTimeInput rowForEdit={rowForEdit} updateState={updateState} columnId="signinDatetime" validationResults={validationResults} upper={upper} lower={moment(rowForEdit.signoutDatetime)} />
				</FormGroup>
			</React.Fragment>
		</>;
	};
	const cardTitle = props.isActive ? "Active Signouts" : "Completed Signouts";
	const f = props.isActive ? (a: SignoutTablesState) => option.isNone(a.signinDatetime) : (a: SignoutTablesState) => option.isSome(a.signinDatetime);
	var columns = props.isActive ? columnsActive : columnsInactive;
			//if (columns[i].accessor === "multisignin") {
			//columns[i] = Object.assign({}, columns[i]);
			//columns[i].Header = <ButtonWrapper spinnerOnClick onClick={() => handleMultiSignIn(multiSignInSelected, props.state, props.setState)}>Multi Sign In</ButtonWrapper>;
			//columns[i].Cell = CellCustomRow((v) => <MultiSigninCheckbox row={v} multiSignInSelected={multiSignInSelected} setMultiSignInSelected={setMultiSignInSelected}/>)
			//}
		//columnsActive.find((a) => a.accessor === "multisignin").Header = <p>do it</p>;
	const filteredSignouts = props.state.filter(f);
	React.useEffect(() => {
		if (props.isActive) {
			const reassignedHullsMap = {};
			const reassignedSailsMap = {};
			filteredSignouts.forEach((a) => { mapOptional(a.hullNumber, a.boatId, a.signoutId, reassignedHullsMap); });
			filteredSignouts.forEach((a) => { mapOptional(a.sailNumber, a.boatId, a.signoutId, reassignedSailsMap); });
			props.setExtraState({ ...props.extraState, reassignedHullsMap, reassignedSailsMap });
		}
	}, [props.state]);

	return <>
		<ReportWithModalForm<any, typeof signoutValidator, any, SignoutsTableFilterState, SignoutTablesState>
			globalFilter={props.globalFilter}
			globalFilterState={props.filterValue}
			rowValidator={signoutValidator}
			rows={filteredSignouts}
			primaryKey="signoutId"
			columns={undefined}
			columnsNew={columns}
			formComponents={formComponents}
			submitRow={putSignout}
			cardTitle={cardTitle}
			columnsNonEditable={SignoutTablesNonEditableObject}
			setRowData={props.setState}
			hidableColumns={true}
			hideAdd={true}
			validateSubmit={(rowForEdit, currentRow) => {
				return isCrewValid(currentRow.$$crew, Number(rowForEdit.boatId), props.extraState.boatTypes) || [];
			}}
			extraState={props.extraState} />
	</>;
};
