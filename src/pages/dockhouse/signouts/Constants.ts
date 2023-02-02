import { MAGIC_NUMBERS } from "app/magicNumbers";
import { SignoutType } from "async/staff/dockhouse/signouts";
import { TestResultEnum } from "async/staff/dockhouse/tests";

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

export const signoutTypesHR = [
	{ value: SignoutType.SAIL, display: "Sail" },
	{ value: SignoutType.CLASS, display: "Class" },
	{ value: SignoutType.RACE, display: "Racing" },
	{ value: SignoutType.TEST, display: "Test" }
];

export const testResultsHR = Object.values(TestResultEnum).map((a) => ({value: a, display: a}));

export const programsHR = [
	{ value: MAGIC_NUMBERS.PROGRAM_TYPE_ID.ADULT_PROGRAM, display: "Adult Program" },
	{ value: MAGIC_NUMBERS.PROGRAM_TYPE_ID.HIGH_SCHOOL, display: "High School" },
	{ value: MAGIC_NUMBERS.PROGRAM_TYPE_ID.JUNIOR_PROGRAM, display: "Junion Program" },
	{ value: MAGIC_NUMBERS.PROGRAM_TYPE_ID.UNIVERSAL_ACCESS_PROGRAM, display: "UAP" }
];

export const iconWidth = 30;
export const iconHeight = 30;

export const POLL_FREQ_SEC = 10;