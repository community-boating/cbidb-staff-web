import * as t from "io-ts";
import { makeOptionalPK, OptionalNumber } from "util/OptionalTypeValidators";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

export const tagValidator = t.type({
	tagId: t.number,
	tagName: t.string,
});

export const validator = t.array(tagValidator);

const path = "/rest/tag";

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
});

const resultValidator = t.type({
	TAG_ID: t.number,
});

export const putWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator: makeOptionalPK(tagValidator, "tagId"),
	resultValidator,
});
