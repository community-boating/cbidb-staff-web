import { MAGIC_NUMBERS } from "app/magicNumbers";

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