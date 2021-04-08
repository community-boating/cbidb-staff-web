import * as t from 'io-ts';
import APIWrapper from '../core/APIWrapper';
import { HttpMethod } from "../core/HttpMethod";

const path = "/logout"

export const logout = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.null
})

