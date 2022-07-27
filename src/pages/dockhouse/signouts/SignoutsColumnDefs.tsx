import * as React from 'react';
import { SelectOption } from './input/ValidatedInput';
import { none, Option } from 'fp-ts/lib/Option';
import { option } from 'fp-ts';
import * as moment from "moment";
import reassignedIcon from "assets/img/reassigned.png";
import stopwatchIcon from "assets/img/stopwatch.jpg";
import { FlagStatusIcons } from './FlagStatusIcons';
import { RatingsHover } from './RatingSorter';
import { CrewHover } from './input/EditCrewModal';
import { iconWidth, iconHeight, programsHR, signoutTypesHR, orphanedRatingsShownByDefault } from './Constants';
import { ColumnDef } from '@tanstack/react-table';
import { CellOptionTime, CellOption__ } from 'util/tableUtil';
import { SignoutTablesState, SignoutsTablesState, RatingsValidatorState, CommentsHover, MultiSigninCheckbox, SignoutsTablesExtraState } from './SignoutsTablesPage';
import { ButtonWrapper } from 'components/ButtonWrapper';

function isMax(n: number, a: number[]) {
	if (a === undefined) {
		return true;
	}
	for (var v of a) {
		if (v > n) {
			return false;
		}
	}
	return true;
}
const ReassignedIcon = (props: { row: SignoutTablesState, extraState: SignoutsTablesExtraState }) => {
	const reassignedHullsMap = props.extraState.reassignedHullsMap;
	const reassignedSailsMap = props.extraState.reassignedSailsMap;
	const reassignedHull = option.isSome(props.row.hullNumber || none) && !isMax(props.row.signoutId, (reassignedHullsMap[props.row.hullNumber.getOrElse("")] || [])[props.row.boatId]);
	const reassignedSail = option.isSome(props.row.sailNumber || none) && !isMax(props.row.signoutId, (reassignedSailsMap[props.row.sailNumber.getOrElse("")] || [])[props.row.boatId]);
	if (reassignedHull || reassignedSail) {
		return <img width={iconWidth} height={iconHeight} src={reassignedIcon} />;
	}
	return <></>;
};
const FlagIcon = (props: { row: SignoutTablesState; extraState: SignoutsTablesExtraState }) => {
	const ratings = props.extraState.ratings;
	if (ratings.length == 0) {
		return <p>Loading...</p>;
	}
	const mapped = {};
	ratings.forEach((a) => {
		mapped[String(a.ratingId)] = a;
	});
	const skipperRatings = props.row.$$skipper.$$personRatings.map((a) => mapped[a.ratingId]);
	const flags = skipperRatings.map((a) => getHighestFlag(a, props.row.programId, props.row.boatId)).flatten().filter((a) => FlagStatusIcons[a as string] !== undefined).sort((a, b) => FlagStatusIcons[a as string].sortOrder - FlagStatusIcons[b as string].sortOrder);
	return <img width={iconWidth} height={iconHeight} src={(FlagStatusIcons[flags[0] as string] || FlagStatusIcons.B).src} />;
};
const MakeLinks = (props: { row: SignoutTablesState; isActive: boolean; extraState: SignoutsTablesExtraState }) => {
	if (props.isActive) {
		return <a onClick={() => props.extraState.handleSingleSignIn(props.row.signoutId, false)}>Sign In</a>;
	} else {
		return <a onClick={() => props.extraState.handleSingleSignIn(props.row.signoutId, true)}>Undo Sign In</a>;
	}
};
const StopwatchIcon = (props: { row: SignoutTablesState; }) => {
	//2 hours
	if (moment().diff(moment(props.row.signoutDatetime.getOrElse(""))) > 2 * 60 * 60 * 1000) {
		return <img width={iconWidth} height={iconHeight} src={stopwatchIcon} />;
	}
	return <></>;
};
function getHighestFlag(rating, programId, boatId) {
	return rating !== undefined ? rating.$$boats.filter((a) => a.programId == programId && a.boatId == boatId).map((a) => a.flag) : undefined;
}

export function formatOptional(v: undefined | null | number | string | moment.Moment | Option<any>) {
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

export function formatSelection(s: undefined | null | string | number | moment.Moment | Option<moment.Moment> | Option<string>, selectOptions: SelectOption[]): string {
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

export function getUsersHR(signouts: SignoutsTablesState): SelectOption[] {
	const foundUsers = {};
	signouts.forEach((a) => {
		foundUsers[a.createdBy.getOrElse("")] = true;
	});
	return Object.keys(foundUsers).map((a) => ({ value: a, display: a }));
}

export function makeInitFilter() {
	return { boatType: -1, nameOrCard: "", sail: "", signoutType: "", programId: -1, personId: "", createdBy: "" };
}

export type SignoutsTablesColumnDef = ColumnDef<SignoutTablesState, any>;

export type SignoutsTablesColumnDefProvider= (extraState: SignoutsTablesExtraState) => SignoutsTablesColumnDef[];

const CellSelect = (hr) => (a) => (hr.find((b) => b.value === a.getValue()) || { display: "Loading..." }).display;

const columnsBaseUpper: SignoutsTablesColumnDefProvider = (extraState: SignoutsTablesExtraState) => [
	{
		accessorKey: "edit" as any,
		id: "edit",
		header: "",
		enableSorting: false,
		enableHiding: false,
		size: 50,
		cell: (a) => a.getValue()
	}, {
		header: "Program",
		accessorKey: "programId",
		size: 200,
		cell: CellSelect(programsHR),
	}, {
		header: "Signout Type",
		accessorKey: "signoutType",
		size: 30,
		cell: CellSelect(signoutTypesHR)
	}, {
		header: "Card #",
		accessorKey: "cardNum",
		size: 100,
		cell: CellOption__
	}, {
		header: "Name First",
		accessorKey: "$$skipper.nameFirst",
		size: 100,
	}, {
		header: "Name Last",
		accessorKey: "$$skipper.nameLast",
		size: 100,
	}, {
		header: "Sail #",
		accessorKey: "sailNumber",
		size: 50,
		cell: CellOption__
	}, {
		header: "Hull #",
		accessorKey: "hullNumber",
		size: 50,
		cell: CellOption__
	}, {
		header: "Boat",
		accessorKey: "boatId",
		size: 150,
		cell: (a) => CellSelect(extraState.boatTypesHR)(a)
	}, {
		header: "Signout Time",
		accessorKey: "signoutDatetime",
		size: 100,
		cell: CellOptionTime
	}
];
const columnsBaseLower: (active: boolean) => SignoutsTablesColumnDefProvider = (active) => (extraState) => [
	{
		accessorKey: "$$crew",
		header: "Crew",
		size: 50,
		cell: (a) => <CrewHover row={a.row.original} extraState={extraState} />
	}, {
		accessorFn: () => "Links",
		header: "Links",
		id: "links",
		size: 90,
		cell: (a) => <MakeLinks row={a.row.original} isActive={active} extraState={extraState} />
	}, {
		header: "Ratings",
		id: "ratings__",
		size: 90,
		cell: (a) => <RatingsHover row={a.row.original} orphanedRatingsShownByDefault={orphanedRatingsShownByDefault} extraState={extraState}/>
	}, {
		header: "Comments",
		accessorKey: "comments",
		size: 150,
		cell: (a) => <CommentsHover row={a.row.original} extraState={extraState} />
	}
];

export const columnsInactive: SignoutsTablesColumnDefProvider = (extraState) => columnsBaseUpper(extraState).concat([
	{
		header: "Signin Time",
		accessorKey: "signinDatetime",
		size: 90,
		cell: CellOptionTime
	}
]).concat(columnsBaseLower(false)(extraState));
export const columnsActive: SignoutsTablesColumnDefProvider = (extraState) => columnsBaseUpper(extraState).concat(columnsBaseLower(true)(extraState)).concat([
	{
		accessorFn: () => "MutliSignIn",
		header: (a) =>  <ButtonWrapper spinnerOnClick onClick={(e) => {e.preventDefault(); return extraState.handleMultiSignIn(extraState.multiSignInSelected);}}>Multi Sign In</ButtonWrapper>,
		id: "multisignin__",
		enableSorting: false,
		enableHiding: false,
		size: 90,
		cell: (a) => <MultiSigninCheckbox row={a.row.original} extraState={extraState} />
	}, {
		accessorFn: () => "Icons",
		header: "Icons",
		id: "icons__",
		enableSorting: false,
		size: 150,
		cell: (a) => { const o = a.row.original; return (<>{<FlagIcon row={o} extraState={extraState} />}{<StopwatchIcon row={o} />}{<ReassignedIcon row={o} extraState={extraState} />}</>); }
	}
]);
