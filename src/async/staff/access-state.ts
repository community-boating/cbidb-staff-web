import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const accessProfileValidator = t.type({
	id: t.number,
	name: t.string,
	roles: t.array(t.number)
})

const roleValidator = t.type({
	id: t.number,
	name: t.string,
	description: t.string,
	permissions: t.array(t.number)
})

const userValidator = t.type({
	userName: t.string,
	accessProfileId: t.number,
	extraRoles: t.array(t.number)
})

export const accessStateValidator = t.type({
	accessProfiles: t.array(accessProfileValidator),
	roles: t.array(roleValidator),
	users: t.array(userValidator)
})

const path = "/staff/access-state"

export const getWrapper = new APIWrapper({
	path: path,
	type: HttpMethod.GET,
	resultValidator: accessStateValidator
})
