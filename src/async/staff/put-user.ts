import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString, OptionalBoolean, OptionalNumber } from '../../util/OptionalTypeValidators';

export const validator = t.type({
	userId: OptionalNumber,
	username: OptionalString,
	nameFirst: OptionalString,
	nameLast: OptionalString,
	email: OptionalString,
	locked: OptionalBoolean,
	pwChangeRequired: OptionalBoolean,
	active: OptionalBoolean,
	hideFromClose: OptionalBoolean
})

const path = "/staff/put-user"

export const postWrapper = new APIWrapper({
	path: path,
	type: HttpMethod.POST,
	postBodyValidator: t.any,
	resultValidator: validator,
})
