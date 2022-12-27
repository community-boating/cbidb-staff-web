import * as t from "io-ts";
import APIWrapper from "core/APIWrapper";
import { HttpMethod } from "core/HttpMethod";

export const guestPrivValidator = t.type({
	membershipId: t.number,
	price: t.number,
});

export const validator = t.array(guestPrivValidator);

const path = "/rest/guest-priv/get-all-for-person";

export const getWrapper = (id: number) =>
	new APIWrapper({
		path: path + "?personId=" + id,
		type: HttpMethod.GET,
		resultValidator: validator,
	});
