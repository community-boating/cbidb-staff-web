import * as t from "io-ts";
import APIWrapper from "core/APIWrapper";
import { HttpMethod } from "core/HttpMethod";

export const damageWaiverValidator = t.type({
	WAIVER_ID: t.number,
	PERSON_ID: t.number,
	PRICE: t.number,
});

export const validator = t.array(damageWaiverValidator);

const path = "/rest/damage-waiver/get-all-for-person";

export const getWrapper = (id: number) =>
	new APIWrapper({
		path: path + "?personId=" + id,
		type: HttpMethod.GET,
		resultValidator: validator,
	});

const resultValidator = t.type({
	WAIVER_ID: t.number,
});

export const putWrapper = new APIWrapper<
	typeof resultValidator,
	typeof damageWaiverValidator,
	null
>({
	path,
	postBodyValidator: damageWaiverValidator,
	type: HttpMethod.POST,
	resultValidator,
});
