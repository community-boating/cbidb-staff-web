import * as React from 'react';
import { Col, Input } from 'reactstrap';
import * as t from "io-ts";

import { boatTypesValidator, getBoatTypes, getRatings, putSignout, ratingsValidator, signoutsValidator, signoutValidator, signoutCrewValidator, putSignouts } from 'async/rest/signouts-tables';
import { UpdateStateType } from 'components/ReportWithModalForm';
import { ValidatedHourInput, ValidatedMinuteInput, ValidatedAmPmInput, wrapForFormComponentsMoment, SelectOption } from './input/ValidatedInput';
import { Option } from 'fp-ts/lib/Option';
import { option } from 'fp-ts';
import * as moment from "moment";


import { sortRatings, SortedRatings } from './RatingSorter';
import { MultiHover } from './MultiHover';
import { Info } from 'react-feather';
import { EditCommentsModal } from './input/EditCommentModal';
import { DefaultDateTimeFormat } from 'util/OptionalTypeValidators';
import { EditCrewModal } from './input/EditCrewModal';
import { SignoutsTableFilter, SignoutsTableFilterState } from './input/SignoutsTableFilter';
import { filterActive, SignoutsTable } from './SignoutsTable';
import { makeInitFilter, getUsersHR } from './SignoutsColumnDefs';
import { Row } from '@tanstack/react-table';

export type SignoutTablesState = t.TypeOf<typeof signoutValidator>;
export type SignoutsTablesState = (SignoutTablesState[]);
export type SignoutsTablesStateRaw = t.TypeOf<typeof signoutsValidator>;
export type BoatTypesValidatorState = t.TypeOf<typeof boatTypesValidator>;
export type RatingsValidatorState = t.TypeOf<typeof ratingsValidator>;

type ReassignedMapType = { [key: string]: { [key: number]: number[] } };

function matchNameOrCard(row: SignoutTablesState, nameOrCard: string) {
	if(nameOrCard.trim().length === 0){
		return true;
	}
	const nameOrCardFromRow = row.$$skipper.nameFirst.concat(row.$$skipper.nameLast).concat(row.cardNum.getOrElse("")).replace(" ", "").toLowerCase();
	for (const string of nameOrCard.toLowerCase().split(" ")){
		if(nameOrCardFromRow.includes(string)){
			return true;
		}
	}
	return false;
}

export function filterRows(row: Row<SignoutTablesState>, columnId: string, filterValue: SignoutsTableFilterState, addMeta) {
	//Just run once for the row, otherwise we can just return false for the other columns.
	if(columnId !== "programId"){
		return false;
	}
	return (filterValue.sail.trim().length === 0 || (row.original.sailNumber.getOrElse("")) == (filterValue.sail.trim())) &&
		matchNameOrCard(row.original, filterValue.nameOrCard) &&
		(filterValue.boatType === -1 || (row.original.boatId == filterValue.boatType)) &&
		(filterValue.programId === -1 || (row.original.programId == filterValue.programId)) &&
		(filterValue.signoutType.length === 0 || (row.original.signoutType == filterValue.signoutType)) &&
		(filterValue.createdBy.length === 0 || (row.original.createdBy.getOrElse("") == filterValue.createdBy));
}

export type SignoutsTablesExtraState = {
	multiSignInSelected: number[]
	setUpdateCrewModal: (signoutId: number) => void
	setUpdateCommentsModal: (signoutId: number) => void
	setMultiSignInSelected: (selected: number[]) => void
} & SignoutsTablesExtraStateDepOnMainState & SignoutsTablesExtraStateDepOnAsync
type SignoutsTablesExtraStateDepOnMainState = {
	reassignedHullsMap: ReassignedMapType
	reassignedSailsMap: ReassignedMapType
	handleSingleSignIn: (signoutId: number, isUndo: boolean) => void
	handleMultiSignIn: (signoutsSelected: number[]) => Promise<any>
}
type SignoutsTablesExtraStateDepOnAsync = {
	ratingsSorted: SortedRatings
	boatTypesHR: SelectOption[]
} & AsyncPageState
type AsyncPageState = {
	ratings: RatingsValidatorState
	boatTypes: BoatTypesValidatorState
}

function getPropsMemoDep(state: SignoutsTablesState){
	return state.map((a) => a.updatedOn.getOrElse("")).join();
}

export const SignoutsTablesPage = (props: {
	initState: SignoutsTablesState,
}) => {
	const [state, setState] = React.useState(props.initState);
	React.useEffect(() => {
		setState(props.initState);
	}, [getPropsMemoDep(props.initState)]);
	
	const [updateCommentsModal, setUpdateCommentsModal] = React.useState(undefined as number);
	const [updateCrewModal, setUpdateCrewModal] = React.useState(undefined as number);
	const [multiSignInSelected, setMultiSignInSelected] = React.useState([] as number[]);
	const extraStateDepOnMain = React.useMemo(() => {
		const filteredSignouts = state.filter(filterActive(true));
		const reassignedHullsMap = {};
		const reassignedSailsMap = {};
		filteredSignouts.forEach((a) => { mapOptional(a.hullNumber, a.boatId, a.signoutId, reassignedHullsMap); });
		filteredSignouts.forEach((a) => { mapOptional(a.sailNumber, a.boatId, a.signoutId, reassignedSailsMap); });
		return {
			reassignedHullsMap,
			reassignedSailsMap,
			handleMultiSignIn: (a) => {
				return handleMultiSignIn(a, setMultiSignInSelected, state, setState);
			},
			handleSingleSignIn: (a, b) => {
				handleSingleSignIn(a, b, state, setState);
			}
		};
	}, [state]);
	const [extraStateDepOnAsync, setExtraStateDepOnAsync] = React.useState<SignoutsTablesExtraStateDepOnAsync>({ratings: [], ratingsSorted: {ratingsRows: [], orphanedRatings: []}, boatTypes: [], boatTypesHR: []});
	const [filterValue, setFilterValue] = React.useState(makeInitFilter());
	const asyncStateResponse: AsyncPageState = React.useMemo(() => ({ratings: undefined, boatTypes: undefined}), []);
	const handleAsyncResponse = () => {
		if(asyncStateResponse.boatTypes !== undefined && asyncStateResponse.ratings !== undefined){
			setExtraStateDepOnAsync({
				boatTypes: asyncStateResponse.boatTypes,
				boatTypesHR: makeBoatTypesHR(asyncStateResponse.boatTypes),
				ratings: asyncStateResponse.ratings,
				ratingsSorted: sortRatings(asyncStateResponse.ratings)
			})
		}
	};
	React.useEffect(() => {
		getBoatTypes.send().then((a) => {
			if (a.type == "Success") {
				asyncStateResponse.boatTypes = a.success;
				handleAsyncResponse();
			}
		});
	}, []);
	React.useEffect(() => {
		getRatings.send().then((a) => {
			if (a.type == "Success") {
				asyncStateResponse.ratings = a.success;
				handleAsyncResponse();
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
	const extraState: SignoutsTablesExtraState = React.useMemo(() => ({
		...extraStateDepOnMain,
		...extraStateDepOnAsync,
		multiSignInSelected,
		setUpdateCommentsModal,
		setUpdateCrewModal,
		setMultiSignInSelected
	}), [extraStateDepOnMain, extraStateDepOnAsync, multiSignInSelected]);

	const tableContent = React.useMemo(() => {
		return <>
			<SignoutsTableFilter tdStyle={tdStyle} labelStyle={labelStyle} filterValue={filterValue} updateState={updateState} boatTypesHR={extraState.boatTypesHR} setFilterValue={setFilterValue} usersHR={usersHR} />
			<SignoutsTable {...props} state={state} setState={setState} extraState={extraState} isActive={true} filterValue={filterValue} globalFilter={filterRows} />
			<SignoutsTable {...props} state={state} setState={setState} extraState={extraState} isActive={false} filterValue={filterValue} globalFilter={filterRows} />
		</>;
	}, [state, extraState, filterValue]);

	const modalContent = React.useMemo(() => {
		return <>
		<EditCommentsModal modalIsOpen={updateCommentsModal !== undefined} closeModal={() => { setUpdateCommentsModal(undefined) }} currentRow={state.find((a) => a.signoutId == updateCommentsModal)} updateComments={updateCommentsSubmit} />
		<EditCrewModal modalIsOpen={updateCrewModal !== undefined} closeModal={() => { setUpdateCrewModal(undefined) }} boatTypes={extraState.boatTypes} boatTypesHR={extraState.boatTypesHR} currentRow={state.find((a) => a.signoutId == updateCrewModal)} updateCurrentRow={(row) => {
			const newState = state.map((a) => {
				if(a.signoutId == row.signoutId){
					return row;
				}else{
					return a;
				}
			})
			setState(newState);
		}} />
		</>
	}, [state, updateCommentsModal, updateCrewModal, extraState.boatTypes]);

	return <>
		{tableContent}
		{modalContent}
	</>;


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

export const CommentsHover = (props: { row: SignoutTablesState, extraState: SignoutsTablesExtraState }) => {
	const display = <>Comments{props.row.comments["_tag"] === "Some" ? <Info color="#777" size="1.4em" /> : <></>}</>;
	return <MultiHover makeChildren={() => props.row.comments["_tag"] === "Some" ? <p>{props.row.comments.getOrElse("")}</p> : undefined} handleClick={() => props.extraState.setUpdateCommentsModal(props.row.signoutId)} openDisplay={display} noMemoChildren={true} />;
}

export const MultiSigninCheckbox = (props: { row: SignoutTablesState, extraState: SignoutsTablesExtraState }) => {
	return <Input type="checkbox" style={{ display: "block", margin: "0 auto", position: "relative" }} checked={props.extraState.multiSignInSelected.contains(props.row.signoutId)} onChange={(e) => { if (e.target.checked) { props.extraState.setMultiSignInSelected(props.extraState.multiSignInSelected.concat(props.row.signoutId)) } else { props.extraState.setMultiSignInSelected(props.extraState.multiSignInSelected.filter((a) => a != props.row.signoutId)) } }} />;
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

function handleMultiSignIn(multiSignInSelected: number[], setMultiSignInSelected: (selected: number[]) => void, state: SignoutsTablesState, setState: (state: SignoutsTablesState) => void): Promise<any> {
	const signinDatetime = option.some(moment().format(DefaultDateTimeFormat));
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
			setMultiSignInSelected([]);
		} else {
			alert("internal server error");
		}
	});
}

function handleSingleSignIn(signoutId: number, isUndo: boolean, state: SignoutsTablesState, setState: (state: SignoutsTablesState) => void) {
	const signinDatetime = isUndo ? option.none : option.some(moment().format(DefaultDateTimeFormat));
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


