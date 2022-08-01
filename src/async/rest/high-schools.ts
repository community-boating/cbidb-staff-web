import * as t from "io-ts";
import { OptionalNumber } from "util/OptionalTypeValidators";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

export const highSchoolValidator = t.type({
	SCHOOL_ID: t.number,
	SCHOOL_NAME: t.string,
	ACTIVE: t.boolean
});

export const validator = t.array(highSchoolValidator);

const path = "/rest/high-school";

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
});

const resultValidator = t.type({
	SCHOOL_ID: t.number
});

export const putWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator: highSchoolValidator,
	resultValidator,
});
