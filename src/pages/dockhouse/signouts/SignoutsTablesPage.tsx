import * as React from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, Input, Modal, ModalBody, ModalFooter, ModalHeader, Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import * as t from "io-ts";

import { boatsValidator, boatTypesValidator, getBoatTypes, getRatings, getSignoutsToday, programsValidator, putSignout, ratingsValidator, ratingValidator, signoutsValidator, signoutValidator, signoutCrewValidator, getPersonByCardNumber, crewPersonValidator, putSignouts, putSignoutCrew, deleteSignoutCrew } from 'async/rest/signouts-tables';
import { MAGIC_NUMBERS } from 'app/magicNumbers';
import { UpdateStateType } from 'components/ReportWithModalForm';
import { SimpleReportColumn } from 'core/SimpleReport';
import { stringify, stringifyEditable } from 'util/StringifyObjectProps';
import { ValidatedHourInput, ValidatedMinuteInput, ValidatedAmPmInput, wrapForFormComponentsMoment, SelectOption } from './input/ValidatedInput';
import { isSome, Option } from 'fp-ts/lib/Option';
import { option } from 'fp-ts';
import * as moment from "moment";


import { sortRatings, findOrphanedRatings, SortedRatings } from './RatingSorter';
import { MultiHover } from './MultiHover';
import { X, Info } from 'react-feather';
import { makePostJSON } from 'core/APIWrapper';
import { EditCommentsModal } from './input/EditCommentModal';
import { ButtonWrapper } from 'components/ButtonWrapper';
import { DefaultDateTimeFormat, momentNowDefaultDateTime } from 'util/OptionalTypeValidators';
import { EditCrewModal } from './input/EditCrewModal';
import { ErrorPopup } from 'components/ErrorPopup';
import { SignoutsTableFilter, SignoutsTableFilterState } from './input/SignoutsTableFilter';
import { SignoutsTable } from './SignoutsTable';
import { makeInitFilter, getUsersHR } from './SignoutsColumnDefs';
import { Row } from '@tanstack/react-table';

//Extra state is passed to each row so as to maintain a purely array like object to present to the react-table library
//Even though its value is the same each time, the cost shouldn't be much as its not copying anything
export type SignoutsTablesState = t.TypeOf<typeof signoutsValidator>;
export type SignoutTablesState = t.TypeOf<typeof signoutValidator> & {extraState?: SignoutsTablesExtraState};
export type BoatTypesValidatorState = t.TypeOf<typeof boatTypesValidator>;
export type RatingsValidatorState = t.TypeOf<typeof ratingsValidator>;

type ReassignedMapType = { [key: string]: { [key: number]: number[] } };

export function filterRows(row: Row<SignoutTablesState>, columnId: string, filterValue: SignoutsTableFilterState, addMeta) {
	return (filterValue.sail.trim().length === 0 || (row.original.sailNumber.getOrElse("")) == (filterValue.sail.trim())) &&
		(filterValue.nameOrCard.trim().length === 0 || (row.original.$$skipper.nameFirst).concat(row.original.$$skipper.nameLast).concat(row.original.cardNum.getOrElse("")).toLowerCase().includes(filterValue.nameOrCard.toLowerCase())) &&
		(filterValue.boatType === -1 || (row.original.boatId == filterValue.boatType)) &&
		(filterValue.programId === -1 || (row.original.programId == filterValue.programId)) &&
		(filterValue.signoutType.length === 0 || (row.original.signoutType == filterValue.signoutType)) &&
		(filterValue.createdBy.length === 0 || (row.original.createdBy.getOrElse("") == filterValue.createdBy));
}

export type SignoutsTablesExtraState = {
	reassignedHullsMap: ReassignedMapType
	reassignedSailsMap: ReassignedMapType
	multiSignInSelected: number[]
	setMultiSignInSelected: (selected: number[]) => void
	setSelected: (id: number, selected: boolean) => void
	ratings: RatingsValidatorState
	ratingsSorted: SortedRatings
	boatTypes: BoatTypesValidatorState
	boatTypesHR: SelectOption[]
	setUpdateCrewModal: (signoutId: number) => void
	setUpdateCommentsModal: (signoutId: number) => void
	handleSingleSignIn
}

export const SignoutsTablesPage = (props: {
	initState: SignoutsTablesState,
}) => {
	const [state, setState] = React.useState(props.initState);
	React.useEffect(() => {
		setState(props.initState);
	}, [props.initState]);
	const [updateCommentsModal, setUpdateCommentsModal] = React.useState(undefined as number);
	const [updateCrewModal, setUpdateCrewModal] = React.useState(undefined as number);
	const [multiSignInSelected, setMultiSignInSelected] = React.useState([] as number[]);
	const [extraState, setExtraState] = React.useState({
		reassignedHullsMap: {},
		reassignedSailsMap: {},
		boatTypes: [],
		boatTypesHR: [],
		ratings: [],
		ratingsSorted: {ratingsRows: []},
		multiSignInSelected: [],
		setMultiSignInSelected,
		setUpdateCrewModal,
		setUpdateCommentsModal
	} as SignoutsTablesExtraState);
	React.useEffect(() => {
		setExtraState((s) => ({...s, multiSignInSelected: multiSignInSelected}));
	}, [multiSignInSelected]);
	React.useEffect(() => {
		setExtraState((s) => ({...s, handleSingleSignIn: (a, b) => {
			handleSingleSignIn(a, b, state, setState);
		}}));
	}, [state]);
	const [filterValue, setFilterValue] = React.useState(makeInitFilter());
	const setBoatTypes = (boatTypes: BoatTypesValidatorState) => {
		setExtraState((s) => ({...s, boatTypes: boatTypes, boatTypesHR: makeBoatTypesHR(boatTypes)}));
	}
	const setRatings = (ratings: RatingsValidatorState) => {
		setExtraState((s) => ({...s, ratings, ratingsSorted: sortRatings(ratings)}));
	}
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
				setRatings(a.success);
			}
		});
	}, []);
	const usersHR = React.useMemo(() => getUsersHR(state), [state]);

	const updateState = (id: any, value: any) => {
		const newFilterState = Object.assign({}, filterValue);
		newFilterState[id] = value;
		setFilterValue(newFilterState);
	};
	const updateCommentsSubmit = (comments: Option<string>, signoutId: number, setErrors: (errors: React.SetStateAction<string[]>) => void) => putSignout.sendJson({ signoutId: signoutId, comments: comments }).then((a) => {
		if (a.type === "Success") {
			setUpdateCommentsModal(undefined);
			const newRows = Object.assign([], state);
			for (var row of newRows) {
				if (row.signoutId == signoutId) {
					row.comments = comments;
				}
			}
			setState(newRows);
		} else {
			setErrors(["Server error updating comments"]);
		}
	});
	const tdStyle: React.CSSProperties = { verticalAlign: "middle", textAlign: "right" };
	const labelStyle: React.CSSProperties = { margin: 0 };
	//Do the memo so updates that dont change the main tables state can avoid rerendering the entire table
	return React.useMemo(() => {
	return <>
		<SignoutsTableFilter tdStyle={tdStyle} labelStyle={labelStyle} filterValue={filterValue} updateState={updateState} boatTypesHR={extraState.boatTypesHR} setFilterValue={setFilterValue} usersHR={usersHR} />
		<SignoutsTable {...props} state={state} setState={setState} extraState={extraState} setExtraState={setExtraState} isActive={true} filterValue={filterValue} globalFilter={filterRows} />
		<SignoutsTable {...props} state={state} setState={setState} extraState={extraState} setExtraState={setExtraState} isActive={false} filterValue={filterValue} globalFilter={filterRows} />
		<EditCommentsModal modalIsOpen={updateCommentsModal !== undefined} closeModal={() => { setUpdateCommentsModal(undefined) }} currentRow={state.find((a) => a.signoutId == updateCommentsModal)} updateComments={updateCommentsSubmit} />
		<EditCrewModal modalIsOpen={updateCrewModal !== undefined} closeModal={() => { setUpdateCrewModal(undefined) }} boatTypes={extraState.boatTypes} currentRow={state.find((a) => a.signoutId == updateCrewModal)} updateCurrentRow={(row) => {
			
		}} />
	</>;
	}, [state, extraState, updateCommentsModal, updateCrewModal, filterValue]);


}

export function mapOptional(n: Option<string>, boatId: number, signoutId: number, b: { [key: string]: { [key: number]: number[] } }) {
	if (option.isSome(n)) {
		var val = (b[n.getOrElse("")] || {})
		val[boatId] = (val[boatId] || []).concat(signoutId);
		b[n.getOrElse("")] = val;
	}
}

function makeBoatTypesHR(boatTypes: BoatTypesValidatorState) {
	return boatTypes.sort((a, b) => a.displayOrder - b.displayOrder).map((v) => ({ value: v.boatId, display: v.boatName }));
}

export const CommentsHover = (props: { row: SignoutTablesState}) => {
	const display = <>Comments{props.row.comments["_tag"] === "Some" ? <Info color="#777" size="1.4em" /> : <></>}</>;
	return <MultiHover makeChildren={() => props.row.comments["_tag"] === "Some" ? <p>{props.row.comments.getOrElse("")}</p> : undefined} handleClick={() => props.row.extraState.setUpdateCommentsModal(props.row.signoutId)} openDisplay={display} noMemoChildren={true} />;
}

export const MultiSigninCheckbox = (props: { row: SignoutTablesState}) => {
	return <Input type="checkbox" style={{display:"block", margin: "0 auto", position: "relative"}} checked={props.row.extraState.multiSignInSelected.contains(props.row.signoutId)} onChange={(e) => { if (e.target.checked) { props.row.extraState.setMultiSignInSelected(props.row.extraState.multiSignInSelected.concat(props.row.signoutId)) } else { props.row.extraState.setMultiSignInSelected(props.row.extraState.multiSignInSelected.filter((a) => a != props.row.signoutId)) } }} />;
}

export const ValidatedTimeInput: (props: { rowForEdit: any, updateState: UpdateStateType, validationResults, columnId: string, lower: moment.Moment, upper: moment.Moment }) => JSX.Element = (props) => {
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
	const signinDatetime = isUndo ? option.none : option.some(JSON.stringify(momentNowDefaultDateTime()));
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


