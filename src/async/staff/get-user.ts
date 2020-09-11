import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';

export const validator = t.type({
	userId: t.number,
	userName: OptionalString,
	nameFirst: OptionalString,
	nameLast: OptionalString,
	email: OptionalString,
	locked: t.boolean,
	pwChangeRequired: t.boolean,
	active: t.boolean,
	hideFromClose: t.boolean
})

const path = "/staff/get-user"

export const apiw = (userId: number) => new APIWrapper({
	path: path + "?userId=" + userId,
	type: HttpMethod.GET,
	resultValidator: validator,
})
