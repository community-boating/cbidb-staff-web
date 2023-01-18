import * as React from 'react';

import { putSignout, putSignouts } from 'async/staff/dockhouse/signouts-tables';
import { Option } from 'fp-ts/lib/Option';
import { option } from 'fp-ts';
import * as moment from "moment";


import { sortRatings } from './RatingSorter';
import { EditCommentsModal } from './input/EditCommentModal';
import { DefaultDateTimeFormat } from 'util/OptionalTypeValidators';
import { EditCrewModal } from './input/EditCrewModal';
import { makeInitFilter, SignoutsTableFilter, SignoutsTableFilterState } from './input/SignoutsTableFilter';
import { filterActive, SignoutsTable } from './SignoutsTable';
import { getUsersHR } from './SignoutsColumnDefs';
import { Row } from '@tanstack/react-table';
import { BoatTypesValidatorState, ReassignedMapType, SignoutsTablesExtraState, SignoutsTablesExtraStateDepOnAsync, SignoutsTablesState, SignoutTablesState } from './StateTypes';
import { AppStateContext } from 'app/state/AppStateContext';

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

function getPropsMemoDep(state: SignoutsTablesState){
	return state.map((a) => a.updatedOn.getOrElse(moment())).join();
}

export const SignoutsTablesPage = (props: {
	initState: SignoutsTablesState,
}) => {
	const [state, setState] = React.useState(props.initState);
	const asc = React.useContext(AppStateContext);
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
		makeReassignedMaps(filteredSignouts, reassignedHullsMap, reassignedSailsMap);
		return {
			reassignedHullsMap,
			reassignedSailsMap,
			handleSingleSignIn: (a, b) => {
				handleSingleSignIn(a, b, state, setState);
			}
		};
	}, [state]);
	const [extraStateDepOnAsync, setExtraStateDepOnAsync] = React.useState<SignoutsTablesExtraStateDepOnAsync>({ratings: [], ratingsSorted: {ratingsRows: [], orphanedRatings: []}, boatTypes: [], boatTypesHR: []});
	const [filterValue, setFilterValue] = React.useState(makeInitFilter());
	React.useEffect(() => {
		const ratings = asc.state.ratings;
		setExtraStateDepOnAsync((s) => ({...s, ratings: ratings, ratingsSorted: sortRatings(ratings)}));
	}, [asc.state.ratings]);
	React.useEffect(() => {
		const boatTypes = asc.state.boatTypes;
		setExtraStateDepOnAsync((s) => ({...s, boatTypes: boatTypes, boatTypesHR: makeBoatTypesHR(boatTypes)}));
	}, [asc.state.boatTypes]);
	const usersHR = React.useMemo(() => getUsersHR(state), [state]);

	const updateState = (id: any, value: any) => {
		const newFilterState = Object.assign({}, filterValue);
		newFilterState[id] = value;
		setFilterValue(newFilterState);
	};
	const updateCommentsSubmit = (comments: Option<string>, signoutId: number, setErrors: (errors: React.SetStateAction<string[]>) => void) => putSignout.sendJson(asc, { signoutId: signoutId, comments: comments }).then((a) => {
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
			<SignoutsTable {...props} state={state} setState={setState} extraState={extraState} isActive={true} filterValue={filterValue} globalFilter={filterRows} openEditRow={undefined} />
			<SignoutsTable {...props} state={state} setState={setState} extraState={extraState} isActive={false} filterValue={filterValue} globalFilter={filterRows} openEditRow={undefined} />
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

export function makeReassignedMaps(activeSignouts: SignoutsTablesState, reassignedHullsMap: ReassignedMapType, reassignedSailsMap: ReassignedMapType){
	activeSignouts.forEach((a) => { mapOptional(a.hullNumber, a.boatId, a.signoutId, reassignedHullsMap); });
	activeSignouts.forEach((a) => { mapOptional(a.sailNumber, a.boatId, a.signoutId, reassignedSailsMap); });
}

export function mapOptional(n: Option<string>, boatId: number, signoutId: number, b: { [key: string]: { [key: number]: number[] } }) {
	if (option.isSome(n)) {
		var val = (b[n.getOrElse("")] || {})
		val[boatId] = (val[boatId] || []).concat(signoutId);
		b[n.getOrElse("")] = val;
	}
}

export function makeBoatTypesHR(boatTypes: BoatTypesValidatorState) {
	return boatTypes.sort((a, b) => a.displayOrder - b.displayOrder).map((v) => ({ value: v.boatId, display: v.boatName }));
}

function handleSingleSignIn(signoutId: number, isUndo: boolean, state: SignoutsTablesState, setState: (state: SignoutsTablesState) => void) {
	const signinDatetime = isUndo ? option.none : option.some(moment().format(DefaultDateTimeFormat));
	return Promise.reject();
	/*return putSignout.sendJson({ signoutId: signoutId, signinDatetime: signinDatetime }).then((a) => {
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
	})*/
}


