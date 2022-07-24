import { ColumnDef, CoreColumnDefAccessorKey, createColumnHelper } from "@tanstack/react-table";
import { MAGIC_NUMBERS } from "app/magicNumbers";
import { TableColumnOptionsCbi } from "react-table-config";
import { SignoutTablesState } from "./SignoutsTablesPage";
import { CellOptionTime, CellOption } from "util/tableUtil";
import { signoutCrewValidator, signoutValidator, skipperValidator } from "async/rest/signouts-tables";
import * as t from "io-ts";
import { OptionalBoolean, OptionalDateTime, OptionalNumber, OptionalString } from "util/OptionalTypeValidators";

export const orphanedRatingsShownByDefault = {
	4: true,
	28: true,
	61: true,
	62: true,
	68: true,
	131: true,
	132: true,
	133: true,
	134: true
}

const columnsBaseUpper: TableColumnOptionsCbi[] = [
	{
		accessor: "edit",
		Header: "",
		disableSortBy: true,
		width: 50,
	}, {
		Header: "Program",
		accessor: "programId",
		width: 200,
		//toggleHidden: true
	}, {
		Header: "Signout Type",
		accessor: "signoutType",
		width: 30,
	}, {
		Header: "Card #",
		accessor: "cardNum",
		width: 100,
		Cell: CellOption
	}, {
		Header: "Name First",
		accessor: "$$skipper.nameFirst",
		width: 100,
	}, {
		Header: "Name Last",
		accessor: "$$skipper.nameLast",
		width: 100,
		//Cell: CellCustomRow((a) => a.$$skipper.nameLast)
	}, {
		Header: "Sail #",
		accessor: "sailNumber",
		width: 50,
		Cell: CellOption
	}, {
		Header: "Hull #",
		accessor: "hullNumber",
		width: 50,
		Cell: CellOption
	}, {
		Header: "Boat",
		accessor: "boatId",
		width: 150,
	}, {
		Header: "Signout Time",
		accessor: "signoutDatetime",
		width: 100,
		Cell: CellOptionTime
	}
];

const columnsBaseLower: TableColumnOptionsCbi[] = [
	{
		Header: "Crew",
		accessor: "crew__",
		width: 50,
		Cell: () => "Crew"
	}, {
		Header: "Links",
		accessor: "links",
		width: 90,
		Cell: () => "Links"
	}, {
		Header: "Ratings",
		accessor: "ratings__",
		width: 90,
		Cell: () => "Ratings"
	}, {
		Header: "Comments",
		accessor: "comments",
		width: 150,
		Cell: CellOption
	}
];

export const columnsInactive: TableColumnOptionsCbi[] = columnsBaseUpper.concat([
	{
		Header: "Signin Time",
		accessor: "signinDatetime",
		width: 90,
		Cell: CellOptionTime
	}]).concat(columnsBaseLower);
export const columnsActive: TableColumnOptionsCbi[] = columnsBaseUpper.concat(columnsBaseLower).concat([
	{
		Header: "Multi Sign In",
		accessor: "multisignin__",
		disableSortBy: true,
		width: 90,
		Cell: (a) => "Multi Sign In"
	}, {
		Header: "Icons",
		accessor: "icons__",
		disableSortBy: true,
		width: 150,
		Cell: (a) => "Icons"
	}
]);
//columnsWrapped(undefined);

console.log(JSON.stringify(signoutValidator));

//type RowData = SignoutTablesState;

export const SignoutTablesNonEditableObject: SignoutTablesNonEditable[] = ["$$crew", "$$skipper", "personId", "programId", "cardNum"];

export type SignoutTablesNonEditable = "$$crew" | "$$skipper" | "personId" | "programId" | "cardNum";

export const SignoutTypes = {SAIL:"S", CLASS:"C", RACING:"R", TEST:"T"};

export const signoutTypesHR = [
	{ value: SignoutTypes.SAIL, display: "Sail" },
	{ value: SignoutTypes.CLASS, display: "Class" },
	{ value: SignoutTypes.RACING, display: "Racing" },
	{ value: SignoutTypes.TEST, display: "Test" }
];

export const TestResults = {PASS: "Pass", FAIL: "Fail", ABORT: "Abort"};

export const testResultsHR = Object.values(TestResults).map((a) => ({value: a, display: a}));

export const programsHR = [
	{ value: MAGIC_NUMBERS.PROGRAM_TYPE_ID.ADULT_PROGRAM, display: "Adult Program" },
	{ value: MAGIC_NUMBERS.PROGRAM_TYPE_ID.HIGH_SCHOOL, display: "High School" },
	{ value: MAGIC_NUMBERS.PROGRAM_TYPE_ID.JUNIOR_PROGRAM, display: "Junion Program" },
	{ value: MAGIC_NUMBERS.PROGRAM_TYPE_ID.UNIVERSAL_ACCESS_PROGRAM, display: "UAP" }
];

export const iconWidth = 30;
export const iconHeight = 30;

export const POLL_FREQ_SEC = 10;