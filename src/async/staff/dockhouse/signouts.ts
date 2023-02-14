import { OptionalBoolean, OptionalNumber, OptionalString, makeOptionalProps, OptionalDateTime, allowNullUndefinedProps, EnumType } from "util/OptionalTypeValidators";
import * as t from "io-ts";
import APIWrapper from "../../../core/APIWrapper";
import { HttpMethod } from "../../../core/HttpMethod";
import { boatTypesValidator } from "./boats";
import { TestResultValidator } from "./tests";
import { flagEnumValidator } from "./flag-color";

const pathGet = "/rest/signouts-today";
const pathPost = "/rest/signout";
const pathPostMulti = "/rest/signouts";
const pathSignoutCrew = "/rest/signout-crew";
export const pathGetRatings = "/rest/ratings";
const pathPersonByCardNumber = "/rest/person/by-card";

export enum SignoutType{
	TEST = "T",
	SAIL = "S",
	CLASS = "C",
	RACE = "R"
}

export const SignoutTypeValidator = EnumType("signoutType", SignoutType);

export const personRatingValidator = t.type({
	personId: t.number,
	ratingId: t.number,
	programId: t.number
});

export const crewPersonValidator = t.type({
	personId: t.number,
	nameFirst: t.string,
	nameLast: t.string
})

export const signoutCrewValidator = t.type({
	$$person: crewPersonValidator,
	crewId: t.number,
	signoutId: t.number,
	cardNum: OptionalString,
	personId: OptionalNumber,
	startActive: OptionalDateTime,
	endActive: OptionalDateTime
});

export const skipperValidator = t.type({
	$$personRatings: t.array(personRatingValidator),
	nameFirst: t.string,
	nameLast: t.string,
	personId: t.number
});

export const signoutValidator = t.type({
	signoutId: t.number,
	programId: t.number,
	classSessionId: OptionalNumber,
	$$skipper: skipperValidator,
	apAttendanceId: OptionalNumber,
	jpAttendanceId: OptionalNumber,
	boatId: t.number,
	personId: OptionalNumber,
	cardNum: OptionalString,
	sailNumber: OptionalString,
	hullNumber: OptionalString,
	signoutDatetime: OptionalDateTime,
	signinDatetime: OptionalDateTime,
	testRatingId: OptionalNumber,
	testResult: TestResultValidator,
	signoutType: SignoutTypeValidator,
	didCapsize: OptionalBoolean,
	comments: OptionalString,
	createdBy: OptionalString,
	updatedBy: OptionalString,
	updatedOn: OptionalDateTime,
	createdOn: OptionalDateTime,
	$$crew: t.array(signoutCrewValidator)
});

export const boatsValidator = t.type({
	boatId: t.number,
	assignId: t.number,
	programId: t.number,
	flag: flagEnumValidator,
	ratingId: t.number
});

export const programsValidator = t.type({
	assignId: t.number,
	ratingId: t.number,
	programId: t.number
});

export const signoutsValidator = t.array(signoutValidator);

export type SignoutTablesState = t.TypeOf<typeof signoutValidator>;
export type SignoutsTablesState = (SignoutTablesState[]);
export type SignoutsTablesStateRaw = t.TypeOf<typeof signoutsValidator>;
export type BoatTypesValidatorState = t.TypeOf<typeof boatTypesValidator>;

export type SkipperType = t.TypeOf<typeof skipperValidator>;

export const getSignoutsToday = new APIWrapper({
	path:pathGet,
	type: HttpMethod.GET,
	resultValidator: signoutsValidator,
	permissions: []
});

/*export const getPersonByCardNumber = new APIWrapper({
	path: pathPersonByCardNumber,
	type: HttpMethod.GET,
	resultValidator: crewPersonValidator,
});*/

export const putSignoutCrew = new APIWrapper({
	path: pathSignoutCrew,
	type: HttpMethod.POST,
	postBodyValidator: makeOptionalProps(signoutCrewValidator),
	resultValidator: makeOptionalProps(signoutCrewValidator),
});

/*export const deleteSignoutCrew = new APIWrapper({
	path: pathSignoutCrew,
	type: HttpMethod.DELETE,
	resultValidator: makeOptionalProps(signoutCrewValidator),
	postBodyValidator: makeOptionalProps(signoutCrewValidator)
});*/

export const putSignout = new APIWrapper({
	path:pathPost,
	type: HttpMethod.POST,
	postBodyValidator: makeOptionalProps(signoutValidator),
	resultValidator: allowNullUndefinedProps(signoutValidator)
});

export const putSignouts = new APIWrapper({
	path:pathPostMulti,
	type: HttpMethod.POST,
	postBodyValidator: t.array(allowNullUndefinedProps(signoutValidator)),
	resultValidator: t.array(allowNullUndefinedProps(signoutValidator))
});