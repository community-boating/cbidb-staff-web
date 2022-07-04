import { OptionalBoolean, OptionalNumber, OptionalString, makeOptional, makeOptionalProps, OptionalDateTime } from "util/OptionalTypeValidators";
import * as t from "io-ts";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";
import { optionifyProps } from "util/OptionifyObjectProps";
import optionify from "util/optionify";
import { isInteger } from "lodash";

const pathGet = "/rest/signouts-today";
const pathPost = "/rest/signout";
const pathGetBoatTypes = "/rest/boat-types";
const pathGetRatings = "/rest/ratings";
const pathRunagroundCapsize = "/rest/runaground-capsize";
const pathPersonByCardNumber = "/rest/person/by-card";

const HRNames = {
	signoutType: "Signout Type",
	sailNumber: "Sail Number"
}

const StringValidate = new t.Type<string, string, unknown>(
	'OptionalString',
	(input: unknown): input is string => typeof input === 'string',
	(input, context) => (typeof input === 'string' && input.trim().length>0 ? t.success(input) : t.failure(input, context, HRNames[context[1].key] + " cannot be blank")),
	t.identity
);

const IntValidate = new t.Type<number, string, unknown>(
	'number',
	(input: unknown): input is number => typeof input === 'number',
	(input, context) => {return (isInteger(Number(input)) ? t.success(Number(input)) : t.failure(input, context, HRNames[context[1].key] + " is an invalid number"))},
	(a) => String(a)
);

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
	crewId: OptionalNumber,
	signoutId: OptionalNumber,
	cardNum: OptionalString,
	personId: OptionalNumber,
	startActive: OptionalString,
	endActive: OptionalString
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
	testResult: OptionalString,
	signoutType: StringValidate,
	didCapsize: OptionalBoolean,
	comments: OptionalString,
	$$crew: t.array(signoutCrewValidator)
});

export const boatsValidator = t.type({
	boatId: t.number,
	assignId: t.number,
	programId: t.number,
	flag: t.string,
	ratingId: t.number
});

export const programsValidator = t.type({
	assignId: t.number,
	ratingId: t.number,
	programId: t.number
});

export const ratingValidator = t.type({
	ratingName: t.string,
	$$boats: t.array(boatsValidator),
	$$programs: t.array(programsValidator),
	ratingId: t.number,
	overriddenBy: OptionalNumber
});

export const ratingsValidator = t.array(ratingValidator);

export const boatTypeValidator = t.type({
	maxCrew: t.number,
	boatName: t.string,
	minCrew: t.number,
	boatId: t.number,
	displayOrder: t.number,
	active: t.boolean
});

export const boatTypesValidator = t.array(boatTypeValidator);

export const signoutsValidator = t.array(signoutValidator);

export const getSignoutsToday = new APIWrapper({
	path:pathGet,
	type: HttpMethod.GET,
	resultValidator: signoutsValidator,
});

export const getBoatTypes = new APIWrapper({
	path:pathGetBoatTypes,
	type: HttpMethod.GET,
	resultValidator: boatTypesValidator,
});

export const getRatings = new APIWrapper({
	path:pathGetRatings,
	type: HttpMethod.GET,
	resultValidator: ratingsValidator,
});

export const getPersonByCardNumber = new APIWrapper({
	path: pathPersonByCardNumber,
	type: HttpMethod.GET,
	resultValidator: crewPersonValidator,
});

export const putSignout = new APIWrapper({
	path:pathPost,
	type: HttpMethod.POST,
	postBodyValidator: makeOptionalProps(signoutValidator),
	resultValidator: new t.Type("putSignoutValidator", (u): u is string => u instanceof String, (i: any) => (i == "Ok") ? t.success("") : t.failure("", []), (a) => undefined),
});