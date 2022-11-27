import * as t from "io-ts";
import APIWrapper from "core/APIWrapper";
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from "util/OptionalTypeValidators";

export const personSummaryValidator = t.type({
	personId: t.number,
	nameFirst: OptionalString,
	nameLast: OptionalString,
	dob: OptionalString,
	email: OptionalString,
	phonePrimary: OptionalString,
	phoneAlternate: OptionalString,
	emerg1Name: OptionalString,
	emerg1Relation: OptionalString,
	emerg1PhonePrimary: OptionalString,
	emerg1PhoneAlternate: OptionalString,
	emerg2Name: OptionalString,
	emerg2Relation: OptionalString,
	emerg2PhonePrimary: OptionalString,
	emerg2PhoneAlternate: OptionalString,
});

export const validator = personSummaryValidator;

const path = "/rest/person/summary";

export const getWrapper = (id: number) => new APIWrapper({
	path: path + "?personId=" + id,
	type: HttpMethod.GET,
	resultValidator: validator,
});
