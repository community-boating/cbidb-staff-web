import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';
import { none } from 'fp-ts/lib/Option';

export const userValidator = t.type({
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

export const validator = t.array(userValidator)

const path = "/staff/get-users"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
})
