import * as React from 'react';
import { Input, SelectOption } from 'components/wrapped/Input';
import { none, Option } from 'fp-ts/lib/Option';
import { option } from 'fp-ts';
import * as moment from "moment";
import reassignedIcon from "assets/img/reassigned.png";
import stopwatchIcon from "assets/img/stopwatch.jpg";
import { FlagStatusIcon, FlagStatusIcons } from '../../../components/dockhouse/FlagStatusIcons';
import { RatingsHover } from './RatingSorter';
import { CrewHover } from './input/EditCrewModal';
import { iconWidth, iconHeight, programsHR, signoutTypesHR, orphanedRatingsShownByDefault } from './Constants';
import { CellOptionBase, CellOptionTime, CellSelect } from 'util/tableUtil';
import { InteractiveColumnDef } from './InteractiveColumnProvider';
import { SignoutsTablesExtraState, SignoutsTablesState, SignoutTablesState } from './StateTypes';
import { MultiHover } from './MultiHover';
import { Info } from 'react-feather';
import Button from 'components/wrapped/Button';

export const CommentsHover = (props: { row: SignoutTablesState, extraState: SignoutsTablesExtraState }) => {
	const display = <span className="flex flex-row">Comments{props.row.comments["_tag"] === "Some" ? <Info color="#777" size="1.4em" /> : <></>}</span>;
	return <MultiHover makeChildren={() => props.row.comments["_tag"] === "Some" ? <p>{props.row.comments.getOrElse("")}</p> : undefined} handleClick={() => props.extraState.setUpdateCommentsModal(props.row.signoutId)} openDisplay={display} noMemoChildren={true} />;
}

export const MultiSigninCheckbox = (props: { row: SignoutTablesState, extraState: SignoutsTablesExtraState }) => {
	return <Input type="checkbox" className="m-auto" checked={props.extraState.multiSignInSelected.contains(props.row.signoutId)} onChange={(e) => { if (e.target.checked) { props.extraState.setMultiSignInSelected(props.extraState.multiSignInSelected.concat(props.row.signoutId)) } else { props.extraState.setMultiSignInSelected(props.extraState.multiSignInSelected.filter((a) => a != props.row.signoutId)) } }} />;
}

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
const iconClass = "w-[30px]";
const ReassignedIcon = (props: { row: SignoutTablesState, extraState: SignoutsTablesExtraState }) => {
	const reassignedHullsMap = props.extraState.reassignedHullsMap;
	const reassignedSailsMap = props.extraState.reassignedSailsMap;
	const reassignedHull = option.isSome(props.row.hullNumber || none) && !isMax(props.row.signoutId, (reassignedHullsMap[props.row.hullNumber.getOrElse("")] || [])[props.row.boatId]);
	const reassignedSail = option.isSome(props.row.sailNumber || none) && !isMax(props.row.signoutId, (reassignedSailsMap[props.row.sailNumber.getOrElse("")] || [])[props.row.boatId]);
	if (reassignedHull || reassignedSail) {
		return <img className={iconClass} src={reassignedIcon} />;
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
	return <FlagStatusIcon flag={FlagStatusIcons[flags[0] as string] || FlagStatusIcons.B} className={iconClass}/>
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
		return <img className={iconClass} src={stopwatchIcon} />;
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

export function formatSelection(s: undefined | null | string | number | moment.Moment | Option<moment.Moment> | Option<string>, selectOptions: SelectOption<string | number>[]): string {
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

export function getUsersHR(signouts: SignoutsTablesState): SelectOption<string>[] {
	const foundUsers = {};
	signouts.forEach((a) => {
		foundUsers[a.createdBy.getOrElse("")] = true;
	});
	return Object.keys(foundUsers).map((a) => ({ value: a, display: a }));
}

export type SignoutsTablesColumnDef = InteractiveColumnDef<SignoutTablesState, SignoutsTablesExtraState, any>;

const columnsBaseUpper: SignoutsTablesColumnDef[] = [
	{
		header: "Time",
		accessorKey: "signoutDatetime",
		size: 100,
		cell: CellOptionTime
	},
	{
		header: "Program",
		accessorKey: "programId",
		size: 200,
		enableMultiSort: true,
		cellWithExtra: CellSelect(programsHR)
	}, {
		header: "Type",
		accessorKey: "signoutType",
		size: 30,
		enableMultiSort: true,
		cellWithExtra: CellSelect(signoutTypesHR)
	}, {
		header: "Name First",
		accessorKey: "$$skipper.nameFirst",
		size: 100,
	}, {
		header: "Name Last",
		accessorKey: "$$skipper.nameLast",
		size: 100,
	},{
		header: "Card #",
		accessorKey: "cardNum",
		size: 100,
		enableMultiSort: true,
		cell: CellOptionBase("None")
	},
	{
		header: "Boat",
		accessorKey: "boatId",
		size: 150,
		cellWithExtra: (a, extraState) => CellSelect(extraState.boatTypesHR)(a)
	}, {
		header: "Sail #",
		accessorKey: "sailNumber",
		size: 50,
		cell: CellOptionBase("-")
	}, {
		header: "Hull #",
		accessorKey: "hullNumber",
		size: 50,
		cell: CellOptionBase("-")
	},
	{
		accessorKey: "$$crew",
		header: "Additional Crew",
		size: 50,
		cellWithExtra: (a, extraState) => <CrewHover row={a.row.original} extraState={extraState} />
	}
];
const columnsBaseLower: (active: boolean) => SignoutsTablesColumnDef[] = (active) => [
	, {
		accessorFn: () => "Actions",
		header: "Links",
		id: "links",
		size: 90,
		cellWithExtra: (a, extraState) => <MakeLinks row={a.row.original} isActive={active} extraState={extraState} />
	}, 
];

export const columnsInactive: SignoutsTablesColumnDef[] = columnsBaseUpper.concat([
	{
		header: "Signin Time",
		accessorKey: "signinDatetime",
		size: 90,
		cell: CellOptionTime
	}
]).concat(columnsBaseLower(false));
export const columnsActive: SignoutsTablesColumnDef[] = columnsBaseUpper.concat(columnsBaseLower(true)).concat([
	/*{
		accessorFn: () => "MutliSignIn",
		headerWithExtra: (a, extraState) =>  <div style={{width: "100%", display: "grid"}} ><Button style={{margin: "0 auto"}}spinnerOnClick onClick={(e) => {e.preventDefault(); return extraState.handleMultiSignIn(extraState.multiSignInSelected);}}>Multi Sign In</Button></div>,
		id: "multisignin__",
		enableSorting: false,
		enableMultiSort: false,
		enableHiding: false,
		size: 90,
		cellWithExtra: (a, extraState) => <MultiSigninCheckbox row={a.row.original} extraState={extraState} />
	},*/ {
		accessorFn: () => "Icons",
		header: "Actions",
		id: "icons__",
		enableSorting: false,
		size: 150,
		cellWithExtra: (a, extraState) => { const o = a.row.original; return (<div className="flex flex-row">{<FlagIcon row={o} extraState={extraState} />}{<StopwatchIcon row={o} />}{<ReassignedIcon row={o} extraState={extraState} />}</div>); }
	}
]);
