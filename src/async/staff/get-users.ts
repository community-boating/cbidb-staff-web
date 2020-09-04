import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';

export const validator = t.array(t.type({
	userId: t.number,
	userName: t.string,
	nameFirst: OptionalString,
	nameLast: OptionalString,
	email: t.string,
	locked: t.boolean,
	pwChangeRequired: t.boolean,
	active: t.boolean,
	hideFromClose: t.boolean
}))

const path = "/staff/get-users"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
})
