import * as React from 'react';

import { SignoutsTablesState, SignoutTablesState } from 'async/staff/dockhouse/signouts';
import * as moment from "moment";

import { makeInitFilter, SignoutsTableFilter, SignoutsTableFilterState } from './input/SignoutsTableFilter';
import { filterActive, SignoutsTable } from './SignoutsTable';
import { getUsersHR } from './SignoutsColumnDefs';
import { Row } from '@tanstack/react-table';
import { SignoutsTablesExtraStateDepOnAsync, SignoutsTablesExtraState } from './StateTypes';
import { RatingsContext } from 'async/providers/RatingsProvider';
import { BoatsContext } from 'async/providers/BoatsProvider';
import { makeReassignedMaps, makeBoatTypesHR } from './functions';
import { SignoutsTodayContext } from 'async/providers/SignoutsTodayProvider';
import { Card, CardLayout, CardTitleWithGearDropdown, FlexSize, LayoutDirection } from 'components/dockhouse/Card';

function matchNameOrCard(row: SignoutTablesState, nameOrCard: string) {
	if(nameOrCard.trim().length === 0){
		return true;
	}
	const nameOrCardFromRow = row.$$skipper.nameFirst.getOrElse("").concat(row.$$skipper.nameLast.getOrElse("")).concat(row.cardNum.getOrElse("")).replace(" ", "").toLowerCase();
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
		(filterValue.signoutType.isNone() || (row.original.signoutType == filterValue.signoutType.value)) &&
		(filterValue.createdBy.length === 0 || (row.original.createdBy.getOrElse("") == filterValue.createdBy));
}

function getPropsMemoDep(state: SignoutsTablesState){
	return state.map((a) => a.updatedOn.getOrElse(moment())).join();
}

export const SignoutsTablesPage = (props: {
	initState: SignoutsTablesState,
}) => {
	const {state, setState} = React.useContext(SignoutsTodayContext)//React.useState(props.initState);
	const ratings = React.useContext(RatingsContext);
	const boatTypes = React.useContext(BoatsContext);
	//React.useEffect(() => {
	//	setState(props.initState);
	//}, [getPropsMemoDep(props.initState)]);
	
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
			handleSingleSignIn: () => {}
		};
	}, [state]);
	const [extraStateDepOnAsync, setExtraStateDepOnAsync] = React.useState<SignoutsTablesExtraStateDepOnAsync>({ratings: [], boatTypes: [], boatTypesHR: []});
	const [filterValue, setFilterValue] = React.useState(makeInitFilter());
	React.useEffect(() => {
		setExtraStateDepOnAsync((s) => ({...s, ratings: ratings}));
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

	const tdStyle: React.CSSProperties = { verticalAlign: "middle", textAlign: "right" };
	const labelStyle: React.CSSProperties = { margin: 0 };
	const extraState: SignoutsTablesExtraState = React.useMemo(() => ({
		...extraStateDepOnMain,
		...extraStateDepOnAsync,
		multiSignInSelected,
		setUpdateCrewModal
	}), [extraStateDepOnMain, extraStateDepOnAsync, multiSignInSelected]);
	const tableContent = React.useMemo(() => {
		return <CardLayout direction={LayoutDirection.HORIZONTAL} className="h-full">
			<Card title={<CardTitleWithGearDropdown title="Signouts" gearMenu={<SignoutsTableFilter tdStyle={tdStyle} labelStyle={labelStyle} filterValue={filterValue} updateState={updateState} boatTypesHR={extraState.boatTypesHR} setFilterValue={setFilterValue} usersHR={usersHR} />}/>} weight={FlexSize.S_1}>
				<SignoutsTable {...props} state={state} setState={setState} extraState={extraState} isActive={true} filterValue={filterValue} globalFilter={filterRows} />
				<SignoutsTable {...props} state={state} setState={setState} extraState={extraState} isActive={false} filterValue={filterValue} globalFilter={filterRows} />
			</Card>
		</CardLayout>;
	}, [state, extraState, filterValue]);

	return <>
		{tableContent}
	</>;


}


