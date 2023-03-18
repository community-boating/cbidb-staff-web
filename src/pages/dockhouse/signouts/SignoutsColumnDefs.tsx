import * as React from 'react';
import { SelectOption } from 'components/wrapped/Input';
import { none, Option } from 'fp-ts/lib/Option';
import { option } from 'fp-ts';
import * as moment from "moment";
import reassignedIcon from "assets/img/reassigned.png";
import stopwatchIcon from "assets/img/stopwatch.jpg";
import { Flag, FlagStatusIcon, getFlagIcon } from '../../../components/dockhouse/FlagStatusIcons';
import { programsHR, signoutTypesHR } from './Constants';
import { CellOption, CellOptionBase, CellOptionTime, CellSelect } from 'util/tableUtil';
import { InteractiveColumnDef } from '../../../components/table/InteractiveColumnInjector';
import { Info } from 'react-feather';
import { SignoutTablesState, SignoutsTablesState, putSignout } from 'async/staff/dockhouse/signouts';
import { SignoutsTablesExtraState } from './StateTypes';
import { RatingsType } from 'async/staff/dockhouse/ratings';
import { Popover } from 'components/wrapped/Popover';
import { SignoutsTodayContext } from 'async/providers/SignoutsTodayProvider';
import { AppStateContext } from 'app/state/AppStateContext';
import { BoatsContext } from 'async/providers/BoatsProvider';
import { makeBoatTypesHR } from './functions';

export const CommentsHover = (props: { row: SignoutTablesState, extraState: SignoutsTablesExtraState }) => {
	const display = <span className="flex flex-row">Comments{props.row.comments["_tag"] === "Some" ? <Info color="#777" size="1.4em" /> : <></>}</span>;
	//return <MultiHover makeChildren={() => props.row.comments["_tag"] === "Some" ? <p>{props.row.comments.getOrElse("")}</p> : undefined} handleClick={() => props.extraState.setUpdateCommentsModal(props.row.signoutId)} openDisplay={display} noMemoChildren={true} />;
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
	return <p>"broken"</p>;
	if (ratings == undefined || ratings.length == 0) {
		return <p>Loading...</p>;
	}
	const mapped: {[key: string]: RatingsType[number]} = {};
	ratings.forEach((a) => {
		mapped[String(a.ratingId)] = a;
	});
	const skipperRatings = props.row.$$skipper.$$personRatings.map((a) => mapped[a.ratingId]);
	const flags = skipperRatings.map((a) => getHighestFlag(a, props.row.programId, props.row.boatId)).flatten<Flag>();
	return <FlagStatusIcon flag={flags[0]} className={iconClass}/>
};
const MakeLinks = (props: { row: SignoutTablesState; isActive: boolean }) => {
	const signouts = React.useContext(SignoutsTodayContext);
	const asc = React.useContext(AppStateContext);
	const updateSignedIn = (selected: boolean) => {
		console.log("doop");
		const newSignout = {...props.row, signinDatetime: (selected ? option.none : option.some(moment()))};
		console.log(newSignout);
		putSignout.sendJson(asc, newSignout).then((a) => {
			if(a.type == "Success"){
				console.log("done");
				signouts.setState((b) => b.map((c) => c.signoutId == props.row.signoutId ? newSignout : c));
			}else{
				console.log("issue");
			}
		})
	}
	if (props.isActive) {
		return <a onClick={() => updateSignedIn(false)}>Sign In</a>;
	} else {
		return <a onClick={() => updateSignedIn(true)}>Undo Sign In</a>;
	}
};
const StopwatchIcon = (props: { row: SignoutTablesState; }) => {
	//2 hours
	if (moment().diff(moment(props.row.signoutDatetime.getOrElse(moment()))) > 2 * 60 * 60 * 1000) {
		return <img className={iconClass} src={stopwatchIcon} />;
	}
	return <></>;
};
function getHighestFlag(rating: RatingsType[number], programId: number, boatId: number) {
	
	//return rating !== undefined ? rating.$$boats.filter((a) => a.programId == programId && a.boatId == boatId).map((a) => getFlagIcon(a.flag)) : undefined;
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

function CrewHover(props: {crew: SignoutTablesState['$$crew']}){
	return <Popover hoverProps={props.crew} makeChildren={(a) => <div className="grid grid-rows-2 grid-cols-4">{a.map((a, i) => <div key={i}>{a.$$person.nameFirst.getOrElse("")} {a.$$person.nameLast.getOrElse("")}</div>)}</div>} openDisplay={props.crew.length > 0 ? "Crew" : "None"}/>
}

export type SignoutsTablesColumnDef = InteractiveColumnDef<SignoutTablesState, SignoutsTablesExtraState, any>;

function BoatIdHR(props: {boatId: number}){
	const boats = React.useContext(BoatsContext);
	const boatsHR = makeBoatTypesHR(boats);
	if(!boatsHR)
		return <p>Loading...</p>
	return <p>{(boatsHR.find((a) => a.value == props.boatId) || {}).value}</p>
}

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
	},
	{
		header: "Type",
		accessorKey: "signoutType",
		size: 30,
		enableMultiSort: true,
		cellWithExtra: CellSelect(signoutTypesHR)
	},
	{
		header: "Name First",
		accessorKey: "$$skipper.nameFirst",
		cellWithExtra: CellOption,
		size: 100,
	},
	{
		header: "Name Last",
		accessorKey: "$$skipper.nameLast",
		cellWithExtra: CellOption,
		size: 100,
	},
	{
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
		cell: (a) => <BoatIdHR boatId={a.row.original.boatId}/>
	},
	{
		header: "Sail #",
		accessorKey: "sailNumber",
		size: 50,
		cell: CellOptionBase("-")
	},
	{
		header: "Hull #",
		accessorKey: "hullNumber",
		size: 50,
		cell: CellOptionBase("-")
	},
	{
		accessorKey: "$$crew",
		header: "Crew",
		size: 50,
		cell: (a) => <CrewHover crew={a.row.original.$$crew}/>
	}
];
const columnsBaseLower: (active: boolean) => SignoutsTablesColumnDef[] = (active) => [
	{
		accessorFn: () => "Actions",
		header: "Links",
		id: "links",
		size: 90,
		cell: (a) => <MakeLinks row={a.row.original} isActive={active}/>
	}
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
