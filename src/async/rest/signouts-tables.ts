import { OptionalBoolean, OptionalNumber, OptionalString } from "util/OptionalTypeValidators";
import * as t from "io-ts";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

const pathGet = "/rest/signouts-today";
const pathPost = "/rest/signout";

export const signoutCrewValidator = t.type({
	crewId: OptionalNumber,
	signoutId: OptionalNumber,
	cardNumber: OptionalString,
	personId: OptionalNumber,
	startActive: OptionalString,
	endActive: OptionalString
});

export const signoutValidator = t.type({
	signoutId: OptionalNumber,
	programId: OptionalNumber,
	boatId: OptionalNumber,
	personId: OptionalNumber,
	cardNumber: OptionalString,
	sailNumber: OptionalString,
	hullNumber: OptionalString,
	signoutDatetime: OptionalString,
	signinDatetime: OptionalNumber,
	testRatingId: OptionalNumber,
	testResult: OptionalString,
	signoutType: OptionalString,
	didCapsize: OptionalBoolean,
	comments: OptionalString,
	crew: t.array(signoutCrewValidator)
});

export const signoutsValidator = t.array(signoutValidator);

export const getSignoutsToday = new APIWrapper({
	path:pathGet,
	type: HttpMethod.GET,
	resultValidator: signoutsValidator,
});


export const putSignout = new APIWrapper({
	path:pathPost,
	type: HttpMethod.POST,
	postBodyValidator: signoutValidator,
	resultValidator: signoutValidator,
});