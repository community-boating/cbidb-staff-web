import { MAGIC_NUMBERS } from "app/magicNumbers";
import { SimpleReportColumn } from "core/SimpleReport";

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

const columnsBaseUpper: SimpleReportColumn[] = [
	{
		accessor: "edit",
		Header: "Edit",
		disableSortBy: true,
		width: 50,
		toggleHidden: true
	}, {
		Header: "Program",
		accessor: "programId",
		width: 200,
		toggleHidden: true
	}, {
		Header: "Signout Type",
		accessor: "signoutType",
		width: 30
	}, {
		Header: "Card #",
		accessor: "cardNum",
		width: 100
	}, {
		Header: "Name First",
		accessor: "nameFirst",
		width: 100
	}, {
		Header: "Name Last",
		accessor: "nameLast",
		width: 100
	}, {
		Header: "Sail #",
		accessor: "sailNumber",
		width: 50
	}, {
		Header: "Hull #",
		accessor: "hullNumber",
		width: 50
	}, {
		Header: "Boat",
		accessor: "boatId",
		width: 150
	}, {
		Header: "Signout Time",
		accessor: "signoutDatetime",
		width: 100
	}
];

const columnsBaseLower: SimpleReportColumn[] = [
	{
		Header: "Crew",
		accessor: "crew",
		width: 50
	}, {
		Header: "Links",
		accessor: "links",
		width: 90
	}, {
		Header: "Ratings",
		accessor: "ratings",
		width: 90
	}, {
		Header: "Comments",
		accessor: "comments",
		width: 150
	}
];

export const columnsInactive: SimpleReportColumn[] = columnsBaseUpper.concat([
	{
		Header: "Signin Time",
		accessor: "signinDatetime",
		width: 90
	}]).concat(columnsBaseLower);
export const columnsActive: SimpleReportColumn[] = columnsBaseUpper.concat(columnsBaseLower).concat([
	{
		Header: "Multi Sign In",
		accessor: "multisignin",
		disableSortBy: true,
		width: 90
	}, {
		Header: "Icons",
		accessor: "icons",
		disableSortBy: true,
		width: 150,
	}
]);

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