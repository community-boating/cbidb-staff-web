import * as React from 'react';

import { putSignout, SignoutsTablesState, SignoutTablesState } from 'async/staff/dockhouse/signouts';
import { Option } from 'fp-ts/lib/Option';
import * as moment from "moment";

import { sortRatings } from './RatingSorter';
import { makeInitFilter, SignoutsTableFilter, SignoutsTableFilterState } from './input/SignoutsTableFilter';
import { filterActive, SignoutsTable } from './SignoutsTable';
import { getUsersHR } from './SignoutsColumnDefs';
import { Row } from '@tanstack/react-table';
import { AppStateContext } from 'app/state/AppStateContext';
import { SignoutsTablesExtraStateDepOnAsync, SignoutsTablesExtraState } from './StateTypes';
import { RatingsContext } from 'components/dockhouse/providers/RatingsProvider';
import { BoatsContext } from 'components/dockhouse/providers/BoatsProvider';
import { ActionModalContext } from '../../../components/dockhouse/actionmodal/ActionModal';
import { makeReassignedMaps, handleSingleSignIn, makeBoatTypesHR } from './makeReassignedMaps';
import { EditSignoutAction } from 'components/dockhouse/actionmodal/signouts/EditSignoutType';

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
	const ratings = React.useContext(RatingsContext);
	const boatTypes = React.useContext(BoatsContext);
	const asc = React.useContext(AppStateContext);
	const actionModal = React.useContext(ActionModalContext);
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
		setExtraStateDepOnAsync((s) => ({...s, ratings: ratings, ratingsSorted: sortRatings(ratings)}));
	}, [ratings]);
	React.useEffect(() => {
		setExtraStateDepOnAsync((s) => ({...s, boatTypes: boatTypes, boatTypesHR: makeBoatTypesHR(boatTypes)}));
	}, [boatTypes]);
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

	const openEditRow = (row: SignoutTablesState) => {
		actionModal.setAction(new EditSignoutAction(row));
	}

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
			<SignoutsTable {...props} state={state} setState={setState} extraState={extraState} isActive={true} filterValue={filterValue} globalFilter={filterRows} openEditRow={openEditRow} />
			<SignoutsTable {...props} state={state} setState={setState} extraState={extraState} isActive={false} filterValue={filterValue} globalFilter={filterRows} openEditRow={openEditRow} />
		</>;
	}, [state, extraState, filterValue]);

	return <>
		{tableContent}
	</>;


}


