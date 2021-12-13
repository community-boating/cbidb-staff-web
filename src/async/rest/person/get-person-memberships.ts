import * as t from "io-ts";
import APIWrapper from "@core/APIWrapper";
import { HttpMethod } from "@core/HttpMethod";

export const membershipValidator = t.type({
	ASSIGN_ID: t.number,
	PERSON_ID: t.number,
});

export const validator = t.array(membershipValidator);

const path = "/rest/person-membership/get-all-for-person";

export const getWrapper = (id: number) =>
	new APIWrapper({
		path: path + "?personId=" + id,
		type: HttpMethod.GET,
		resultValidator: validator,
	});
