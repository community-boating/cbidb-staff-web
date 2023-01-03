import { OptionalBoolean, OptionalNumber, OptionalString, makeOptionalProps, OptionalDateTime, allowNullUndefinedProps } from "util/OptionalTypeValidators";
import * as t from "io-ts";
import APIWrapper from "../../../core/APIWrapper";
import { HttpMethod } from "../../../core/HttpMethod";

const pathGet = "/rest/signouts-today";
const pathPost = "/rest/signout";
const pathPostMulti = "/rest/signouts";
const pathSignoutCrew = "/rest/signout-crew";
const pathGetBoatTypes = "/rest/boat-types";
const pathGetRatings = "/rest/ratings";
const pathRunagroundCapsize = "/rest/runaground-capsize";
const pathPersonByCardNumber = "/rest/person/by-card";

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
	signoutType: t.string,
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