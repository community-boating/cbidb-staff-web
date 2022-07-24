import * as React from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import * as t from "io-ts";

import { boatsValidator, boatTypesValidator, getBoatTypes, getRatings, getSignoutsToday, programsValidator, putSignout, ratingsValidator, ratingValidator, signoutsValidator, signoutValidator, signoutCrewValidator, getPersonByCardNumber, crewPersonValidator, putSignouts, putSignoutCrew, deleteSignoutCrew } from 'async/rest/signouts-tables';
import { MAGIC_NUMBERS } from 'app/magicNumbers';
import ReportWithModalForm, { UpdateStateType, validationError } from 'components/ReportWithModalForm';
import { SimpleReportColumn } from 'core/SimpleReport';
import { StringifiedProps, stringify, stringifyEditable } from 'util/StringifyObjectProps';
import { ValidatedSelectInput, ValidatedTextInput, ValidatedHourInput, ValidatedMinuteInput, ValidatedAmPmInput, wrapForFormComponents, wrapForFormComponentsMoment, SelectOption } from './input/ValidatedInput';
import { isSome, none, Option } from 'fp-ts/lib/Option';
import { option } from 'fp-ts';
import * as moment from "moment";

import reassignedIcon from "assets/img/reassigned.png";
import stopwatchIcon from "assets/img/stopwatch.jpg";

import { FlagStatusIcons } from './FlagStatusIcons';
import { sortRatings, RatingsHover, findOrphanedRatings } from './RatingSorter';
import { Row } from 'react-table';
import { MultiHover } from './MultiHover';
import { X, Info } from 'react-feather';
import { makePostJSON } from 'core/APIWrapper';
import { EditCommentsModal } from './input/EditCommentModal';
import { ButtonWrapper } from 'components/ButtonWrapper';
import { DefaultDateTimeFormat, momentNowDefaultDateTime } from 'util/OptionalTypeValidators';
import { CrewHover, EditCrewModal } from './input/EditCrewModal';
import { ErrorPopup } from 'components/ErrorPopup';
import { SignoutsTableFilterState, SignoutsTableFilter } from './input/SignoutsTableFilter';
import { iconWidth, iconHeight, programsHR, signoutTypesHR, testResultsHR, columnsActive, columnsInactive, orphanedRatingsShownByDefault, SignoutTablesNonEditableObject, SignoutTypes } from './Constants';

export type SignoutsTablesState = t.TypeOf<typeof signoutsValidator>;
export type SignoutTablesState = t.TypeOf<typeof signoutValidator>;
export type BoatTypesValidatorState = t.TypeOf<typeof boatTypesValidator>;
export type RatingsValidatorState = t.TypeOf<typeof ratingsValidator>;

function isMax(n: number, a: number[]) {
	if(a === undefined){
		return true;
	}
	for (var v of a) {
		if (v > n) {
			return false;
		}
	}
	return true;
}

const ReassignedIcon = (props: { row: SignoutTablesState, reassignedHullsMap: { [key: string]: { [key: number]: number[] } }, reassignedSailsMap: { [key: string]: { [key: number]: number[] } } }) => {
	const reassignedHull = option.isSome(props.row.hullNumber || none) && !isMax(props.row.signoutId, (props.reassignedHullsMap[props.row.hullNumber.getOrElse("")] || [])[props.row.boatId]);
	const reassignedSail = option.isSome(props.row.sailNumber || none) && !isMax(props.row.signoutId, (props.reassignedSailsMap[props.row.sailNumber.getOrElse("")] || [])[props.row.boatId]);
	if (reassignedHull || reassignedSail) {
		return <img width={iconWidth} height={iconHeight} src={reassignedIcon} />
	}
	return <></>;
}

const FlagIcon = (props: { row: SignoutTablesState, ratings: RatingsValidatorState }) => {
	if (props.ratings.length == 0) {
		return <p>Loading...</p>;
	}
	const mapped = {};
	props.ratings.forEach((a) => {
		mapped[String(a.ratingId)] = a;
	});
	const skipperRatings = props.row.$$skipper.$$personRatings.map((a) => mapped[a.ratingId]);
	const flags = skipperRatings.map((a) => getHighestFlag(a, props.row.programId, props.row.boatId)).flatten().filter((a) => FlagStatusIcons[a as string] !== undefined).sort((a, b) => FlagStatusIcons[a as string].sortOrder - FlagStatusIcons[b as string].sortOrder);
	return <img width={iconWidth} height={iconHeight} src={(FlagStatusIcons[flags[0] as string] || FlagStatusIcons.B).src} />;
}

const MakeLinks = (props: { row: SignoutTablesState, isActive: boolean, state: SignoutsTablesState, setState: (state: SignoutsTablesState) => void }) => {
	console.log("running make link");
	if (props.isActive) {
		return <a onClick={() => handleSingleSignIn(props.row.signoutId, false, props.state, props.setState)}>Sign In</a>
	} else {
		return <a onClick={() => handleSingleSignIn(props.row.signoutId, true, props.state, props.setState)}>Undo Sign In</a>;
	}
}

const StopwatchIcon = (props: { row: SignoutTablesState }) => {
	//2 hours
	if (moment().diff(moment(props.row.signoutDatetime.getOrElse(""))) > 2 * 60 * 60 * 1000) {
		return <img width={iconWidth} height={iconHeight} src={stopwatchIcon} />;
	}
	return <></>;
}

function getHighestFlag(rating, programId, boatId) {
	return rating !== undefined ? rating.$$boats.filter((a) => a.programId == programId && a.boatId == boatId).map((a) => a.flag) : undefined;
}

function formatOptional(v: undefined | null | number | string | moment.Moment | Option<any>) {
	if (v == undefined || v == null || (typeof v === "string" && v.length === 0) || v["_tag"] === "None") {
		return "None";
	} else if (typeof v === "string") {
		return v;
	} else if (v["_tag"] === "Some") {
		return String((v as Option<any>).getOrElse(undefined));
	} else {
		return String(v);
	}
}

function formatMoment(m: undefined | null | string | moment.Moment | Option<moment.Moment> | Option<string>, format: string) {
	const stringM = formatOptional(m);
	if (stringM === "None") {
		return stringM;
	} else {
		return moment(stringM).format(format);
	}
}

function formatSelection(s: undefined | null | string | number | moment.Moment | Option<moment.Moment> | Option<string>, selectOptions: SelectOption[]): string {
	const stringS = formatOptional(s);
	if (stringS === "None") {
		return stringS;
	} else {
		for (var i = 0; i < selectOptions.length; i++) {
			if (String(selectOptions[i].value) == stringS) {
				return String(selectOptions[i].display);
			}
		}
		return "Invalid D: " + selectOptions.length;
	}
}

function filterRows(rows: Row<any>[], columnIds: string[], filterValue: SignoutsTableFilterState) {
	return rows.filter((a) => {
		return (filterValue.sail.trim().length === 0 || (a.values['sailNumber'] || "") == (filterValue.sail.trim())) &&
			(filterValue.nameOrCard.trim().length === 0 || (a.values['nameFirst'] || "").concat(a.values['nameLast'] || "").concat(a.values['cardNum'] || "").toLowerCase().includes(filterValue.nameOrCard.toLowerCase())) &&
			(filterValue.boatType.length === 0 || (a.values['boatId'] == filterValue.boatType)) &&
			(filterValue.programId.length === 0 || (a.values['programId'] == filterValue.programId)) &&
			(filterValue.signoutType.length === 0 || (a.values['signoutType'] == filterValue.signoutType))
	}
	);
}

function getUsersHR(signouts: SignoutsTablesState) : SelectOption[]{
	const foundUsers = {};
	signouts.forEach((a) => {
		foundUsers[a.personId.getOrElse(-1)] = true;
	});
	return Object.keys(foundUsers).map((a) => ({value: a, display: a}))
}

export function makeInitFilter() {
	return { boatType: "", nameOrCard: "", sail: "", signoutType: "", programId: "", personId: "" };
}

export type SignoutsTablesStateExtra = {mainState: SignoutsTablesState, extraState: {rating: RatingsValidatorState}};// & {extra: {ratings: RatingsValidatorState}};

export const SignoutsTablesPage = (props: {
	initState: SignoutsTablesState,
}) => {
	const [boatTypes, setBoatTypes] = React.useState([] as BoatTypesValidatorState);
	//const [ratings, setRatings] = React.useState([] as RatingsValidatorState);
	const [filterValue, setFilterValue] = React.useState(makeInitFilter());
	const boatTypesHR = React.useMemo(() => makeBoatTypesHR(boatTypes), [boatTypes]);
	const [state, setState] = React.useState(props.initState);
	/*const setRatings = (ratings: RatingsValidatorState) => {
		setState(props.initState)
	}*/
	React.useEffect(() => {
		setState(props.initState);
	}, [JSON.stringify(props.initState)]);
	React.useEffect(() => {
		getBoatTypes.send().then((a) => {
			if (a.type == "Success") {
				setBoatTypes(a.success);
			}
		});
	}, []);
	React.useEffect(() => {
		getRatings.send().then((a) => {
			if (a.type == "Success") {
				//setRatings(a.success);
			}
		});
	}, []);
	const usersHR = React.useMemo(() => getUsersHR(state), [state]);

	const updateState = (id: any, value: any) => {
		const newFilterState = Object.assign({}, filterValue);
		newFilterState[id] = value;
		setFilterValue(newFilterState);
	};
	const tdStyle: React.CSSProperties = { verticalAlign: "middle", textAlign: "right" };
	const labelStyle: React.CSSProperties = { margin: 0 };
	//Do the memo so updates that dont change the main tables state can avoid rerendering the entire table
	return React.useMemo(() => {
	return <>
		<SignoutsTableFilter tdStyle={tdStyle} labelStyle={labelStyle} filterValue={filterValue} updateState={updateState} boatTypesHR={boatTypesHR} setFilterValue={setFilterValue} usersHR={usersHR} />
		<SignoutsTable {...props} state={state} setState={setState} boatTypes={boatTypes} isActive={true} filterValue={filterValue} globalFilter={filterRows} />
		<SignoutsTable {...props} state={state} setState={setState} boatTypes={boatTypes} isActive={false} filterValue={filterValue} globalFilter={filterRows} />
	</>;
	}, [state, boatTypes, filterValue]);


}

function mapOptional(n: Option<string>, boatId: number, signoutId: number, b: { [key: string]: { [key: number]: number[] } }) {
	if (option.isSome(n)) {
		var val = (b[n.getOrElse("")] || {})
		val[boatId] = (val[boatId] || []).concat(signoutId);
		b[n.getOrElse("")] = val;
	}
}

function makeBoatTypesHR(boatTypes: BoatTypesValidatorState) {
	return boatTypes.sort((a, b) => a.displayOrder - b.displayOrder).map((v) => ({ value: v.boatId, display: v.boatName }));
}

const CommentsHover = (props: { row: SignoutTablesState, setUpdateCommentsModal: (singoutId: number) => void }) => {
	const display = <>Comments{props.row.comments["_tag"] === "Some" ? <Info color="#777" size="1.4em" /> : <></>}</>;
	return <MultiHover makeChildren={() => props.row.comments["_tag"] === "Some" ? <p>{props.row.comments.getOrElse("")}</p> : undefined} handleClick={() => props.setUpdateCommentsModal(props.row.signoutId)} openDisplay={display} noMemoChildren={true} />;
}

const MultiSigninCheckbox = (props: { row: SignoutTablesState, multiSignInSelected: number[], setMultiSignInSelected: (multiSignInSelected: number[]) => void }) => {
	return <Input type="checkbox" style={{display:"block", margin: "0 auto", position: "relative"}} checked={props.multiSignInSelected.contains(props.row.signoutId)} onChange={(e) => { if (e.target.checked) { props.setMultiSignInSelected(props.multiSignInSelected.concat(props.row.signoutId)) } else { props.setMultiSignInSelected(props.multiSignInSelected.filter((a) => a != props.row.signoutId)) } }} />;
}

const ValidatedTimeInput: (props: { rowForEdit: any, updateState: UpdateStateType, validationResults, columnId: string, lower: moment.Moment, upper: moment.Moment }) => JSX.Element = (props) => {
	return <>
		<Col sm={3}>
			<ValidatedHourInput {...wrapForFormComponentsMoment(props.rowForEdit, props.updateState, props.columnId, props.validationResults)} lower={props.lower} upper={props.upper} />
		</Col>
		<Col sm={3}>
			<ValidatedMinuteInput {...wrapForFormComponentsMoment(props.rowForEdit, props.updateState, props.columnId, props.validationResults)} lower={props.lower} upper={props.upper} />
		</Col>
		<Col sm={3}>
			<ValidatedAmPmInput {...wrapForFormComponentsMoment(props.rowForEdit, props.updateState, props.columnId, props.validationResults)} lower={props.lower} upper={props.upper} />
		</Col>
	</>;
}

function handleMultiSignIn(multiSignInSelected: number[], state: SignoutsTablesState, setState: (state: SignoutsTablesState) => void): Promise<any> {
	const signinDatetime = option.some(momentNowDefaultDateTime());
	if (multiSignInSelected.length === 0) {
		return Promise.resolve();
	}
	return putSignouts.sendJson(multiSignInSelected.map((a) => ({ signoutId: a, signinDatetime: signinDatetime }))).then((a) => {
		if (a.type === "Success") {
			const newState = Object.assign([], state);
			for (var i = 0; i < newState.length; i++) {
				if (multiSignInSelected.contains(state[i].signoutId)) {
					newState[i] = Object.assign({}, state[i]);
					newState[i].signinDatetime = signinDatetime;
				}
			}
			setState(newState);
		} else {
			alert("internal server error");
		}
	});
}
const crewType = t.array(signoutCrewValidator);

type SignoutCrewState = t.TypeOf<typeof crewType>;

export function isCrewValid(crew: SignoutCrewState, boatId: number, boatTypes: BoatTypesValidatorState){
	const boat = boatTypes.find((a) => a.boatId == boatId);
	if(boat === undefined){
		return;
	}
	const crewLength = crew.filter((a) => a.endActive.isNone()).length;
	if(boat.maxCrew < crewLength){
		return ["Too many crew members (" + boat.maxCrew + ")"];
	}
	if(boat.minCrew > crewLength){
		return ["Not enough crew members (" + boat.minCrew + ")"];
	}
}

function handleSingleSignIn(signoutId: number, isUndo: boolean, state: SignoutsTablesState, setState: (state: SignoutsTablesState) => void) {
	const signinDatetime = isUndo ? option.none : option.some(momentNowDefaultDateTime());
	return putSignout.sendJson({ signoutId: signoutId, signinDatetime: signinDatetime }).then((a) => {
		if (a.type === "Success") {
			const newState = Object.assign([], state);
			for (var i = 0; i < newState.length; i++) {
				if (state[i].signoutId == signoutId) {
					newState[i] = Object.assign({}, state[i]);
					newState[i].signinDatetime = signinDatetime;
					break;
				}
			}
			setState(newState);
		}
	})
}

const SignoutsTable = (props: {
	state: SignoutsTablesState,
	setState: (state: SignoutsTablesState) => void,
	boatTypes: BoatTypesValidatorState,
	isActive: boolean,
	filterValue: SignoutsTableFilterState,
	globalFilter: (rows: Row<any>[], columnIds: string[], filterValue: SignoutsTableFilterState) => Row<any>[]
}) => {
	const [updateCommentsModal, setUpdateCommentsModal] = React.useState(undefined as number);
	const [updateCrewModal, setUpdateCrewModal] = React.useState(undefined as number);
	const [multiSignInSelected, setMultiSignInSelected] = React.useState([] as number[]);
	const boatTypesHR = React.useMemo(() => makeBoatTypesHR(props.boatTypes), [props.boatTypes]);
	//const ratingsHR = React.useMemo(() => props.state.ratings.sort((a, b) => a.ratingName.localeCompare(b.ratingName)).map((v) => ({ value: v.ratingId, display: v.ratingName, boats: v.$$boats })), [props.state.extra.ratings]);
	// Define edit/add form
	const formComponents = (
		rowForEdit: StringifiedProps<SignoutTablesState>,
		updateState: UpdateStateType,
		currentRow: SignoutTablesState,
		validationResults: validationError[],
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
						}, "boatId", validationResults)} selectOptions={boatTypesHR} showNone="None" />
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
							if(value != SignoutTypes.TEST){
								updateState([id, "testRatingId", "testResult"], [value, "", ""]);
							}else{
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
					{/*
					<Col sm={9}>
						<ValidatedSelectInput {...wrapForFormComponents(rowForEdit, (id, value) => {
							updateState([id, "signoutType"], [value, SignoutTypes.TEST]);
						}, "testRatingId", validationResults)} selectOptions={ratingsHR.filter((a) => a.boats.find((b) => b.boatId == Number(rowForEdit.boatId)) !== undefined)} showNone="None" selectNone={true} />
					</Col>*/}
				</FormGroup>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Test Result
					</Label>
					<Col sm={9}>
						<ValidatedSelectInput {...wrapForFormComponents(rowForEdit, updateState, "testResult", validationResults)} selectOptions={testResultsHR} showNone="None" selectNone={true} disabled={rowForEdit.signoutType!="T"}/>
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
		</>
	};
	const cardTitle = props.isActive ? "Active Signouts" : "Completed Signouts";
	const f = props.isActive ? (a: SignoutTablesState) => option.isNone(a.signinDatetime) : (a: SignoutTablesState) => option.isSome(a.signinDatetime);
	var columns = props.isActive ? columnsActive : columnsInactive;
	if (props.isActive) {
		columns = Object.assign([], columns);
		for (var i = 0; i < columns.length; i++) {
			if (columns[i].accessor === "multisignin") {
				//columns[i] = Object.assign({}, columns[i]);
				//columns[i].Header = <ButtonWrapper spinnerOnClick onClick={() => handleMultiSignIn(multiSignInSelected, props.state, props.setState)}>Multi Sign In</ButtonWrapper>;
				//columns[i].Cell = CellCustomRow((v) => <MultiSigninCheckbox row={v} multiSignInSelected={multiSignInSelected} setMultiSignInSelected={setMultiSignInSelected}/>)
			}
		}
		//columnsActive.find((a) => a.accessor === "multisignin").Header = <p>do it</p>;
	}
	const reassignedHullsMap = {};
	const reassignedSailsMap = {};
	const filteredSignouts = props.state.filter(f);
	React.useEffect(() => {
		if (props.isActive) {
			filteredSignouts.forEach((a) => { mapOptional(a.hullNumber, a.boatId, a.signoutId, reassignedHullsMap) });
			filteredSignouts.forEach((a) => { mapOptional(a.sailNumber, a.boatId, a.signoutId, reassignedSailsMap) });
		}
	}, [filteredSignouts]);

	//const sortedRatings = sortRatings(props.state.extra.ratings);
	const updateCommentsSubmit = (comments: Option<string>, signoutId: number, setErrors: (errors: React.SetStateAction<string[]>) => void) => putSignout.sendJson({ signoutId: signoutId, comments: comments }).then((a) => {
		if (a.type === "Success") {
			setUpdateCommentsModal(undefined);
			const newRows = Object.assign([], props.state);
			for (var row of newRows) {
				if (row.signoutId == signoutId) {
					row.comments = comments;
				}
			}
			props.setState(newRows);
		} else {
			setErrors(["Server error updating comments"]);
		}
	});
	console.log(filteredSignouts);
	return <>
		<ReportWithModalForm
			globalFilterValueControlled={props.filterValue}
			//globalFilter={props.globalFilter}
			rowValidator={signoutValidator}
			rows={filteredSignouts}
			/*	
				icons: props.isActive ? <>{<FlagIcon row={row} ratings={props.ratings} />}{<StopwatchIcon row={row} />}{<ReassignedIcon row={row} reassignedHullsMap={reassignedHullsMap} reassignedSailsMap={reassignedSailsMap} />}</> : <></>,
				ratings: <RatingsHover row={row} sortedRatings={sortedRatings} orphanedRatingsShownByDefault={orphanedRatingsShownByDefault} />,
				crew: <CrewHover row={row} setUpdateCrewModal={setUpdateCrewModal} />,
				comments: <CommentsHover row={row} setUpdateCommentsModal={setUpdateCommentsModal} />,
				multisignin: <MultiSigninCheckbox row={row} multiSignInSelected={multiSignInSelected} setMultiSignInSelected={setMultiSignInSelected} />,
				links: <MakeLinks row={row} isActive={props.isActive} state={props.state} setState={props.setState} />,
				edit: row['edit'],*/
			primaryKey="signoutId"
			columns={columns}
			formComponents={formComponents}
			submitRow={putSignout}
			cardTitle={cardTitle}
			columnsNonEditable={SignoutTablesNonEditableObject}
			setRowData={props.setState}
			hidableColumns={true}
			hideAdd={true}
			validateSubmit={(rowForEdit, currentRow) => {
				return isCrewValid(currentRow.$$crew, Number(rowForEdit.boatId), props.boatTypes) || [];
			}}
		/>
		<EditCommentsModal modalIsOpen={updateCommentsModal !== undefined} closeModal={() => { setUpdateCommentsModal(undefined) }} currentRow={props.state.find((a) => a.signoutId == updateCommentsModal)} updateComments={updateCommentsSubmit} />
		<EditCrewModal modalIsOpen={updateCrewModal !== undefined} closeModal={() => { setUpdateCrewModal(undefined) }} boatTypes={props.boatTypes} currentRow={props.state.find((a) => a.signoutId == updateCrewModal)} updateCurrentRow={(row) => {
			
		}} />
	</>;
}
