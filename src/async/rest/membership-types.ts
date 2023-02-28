import * as t from "io-ts";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

export const memTypeValidator = t.type({
	membershipTypeId: t.number,
	membershipTypeName: t.string,
	active: t.boolean,
	displayOrder: t.number
});

export type MembershipType = t.TypeOf<typeof memTypeValidator>;

export const validator = t.array(memTypeValidator);

const path = "/rest/membership-types";

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
});