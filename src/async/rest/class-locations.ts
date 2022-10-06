import * as t from "io-ts";
import { makeOptionalPK, OptionalNumber } from "util/OptionalTypeValidators";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

export const classLocationValidator = t.type({
	LOCATION_ID: t.number,
	LOCATION_NAME: t.string,
	ACTIVE: t.boolean,
});

export const validator = t.array(classLocationValidator);

const path = "/rest/class-location";

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
});

const resultValidator = t.type({
	LOCATION_ID: t.number,
});

export const putWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator: makeOptionalPK(classLocationValidator, "LOCATION_ID"),
	resultValidator,
});
