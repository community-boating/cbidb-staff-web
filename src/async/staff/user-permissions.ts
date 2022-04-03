import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const validator = t.array(t.number)

const path = "/staff/user-permissions";

export const apiw = () => new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
});
