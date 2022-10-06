import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const validator = t.type({
	success: t.boolean
})

const path = "/staff/finish-open-order"

export const postWrapper = (personId: number) => new APIWrapper({
	path: path + "?personId=" + personId,
	type: HttpMethod.POST,
	postBodyValidator: t.type({}),
	resultValidator: validator
})
