import * as t from "io-ts";
import APIWrapper from "core/APIWrapper";
import { HttpMethod } from "core/HttpMethod";

export const personSummaryValidator = t.type({
	personId: t.number,
	nameFirst: t.string,
	nameLast: t.string,
});

export const validator = personSummaryValidator;

const path = "/rest/person/summary";

export const getWrapper = (id: number) =>
	new APIWrapper({
		path: path + "?personId=" + id,
		type: HttpMethod.GET,
		resultValidator: validator,
	});
