import * as t from "io-ts";
import APIWrapper from "@core/APIWrapper";
import { HttpMethod } from "@core/HttpMethod";

export const personSummaryValidator = t.type({
	PERSON_ID: t.number,
	NAME_FIRST: t.string,
	NAME_LAST: t.string,
});

export const validator = personSummaryValidator;

const path = "/rest/person/summary";

export const getWrapper = (id: number) =>
	new APIWrapper({
		path: path + "?personId=" + id,
		type: HttpMethod.GET,
		resultValidator: validator,
	});
