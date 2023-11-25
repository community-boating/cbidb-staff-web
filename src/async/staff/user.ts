import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { makeOptionalPK, OptionalString } from '../../util/OptionalTypeValidators';

export const userValidator = t.type({
	userId: t.number,
	userName: t.string,
	nameFirst: OptionalString,
	nameLast: OptionalString,
	email: t.string,
	locked: t.boolean,
	pwChangeReqd: t.boolean,
	active: t.boolean,
	hideFromClose: t.boolean,
	pw1: OptionalString,
	pw2: OptionalString,
	accessProfileId: t.number,
})

const getPath = "/staff/get-users"

export const getWrapper = new APIWrapper({
	path: getPath,
	type: HttpMethod.GET,
	resultValidator: t.array(userValidator),
})


const postPath = "/staff/put-user"

export const postWrapper = new APIWrapper({
	path: postPath,
	type: HttpMethod.POST,
	postBodyValidator: makeOptionalPK(userValidator, "userId"),
	resultValidator: userValidator,
})
