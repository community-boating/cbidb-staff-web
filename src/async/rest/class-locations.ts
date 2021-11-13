import * as t from "io-ts";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

export const classLocationValidator = t.type({
	LOCATION_ID: t.number,
	LOCATION_NAME: t.string,
	ACTIVE: t.boolean,
});

export const validator = t.array(classLocationValidator);

const path = "/rest/class-location";

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
});

const resultValidator = t.type({
	LOCATION_ID: t.number,
	LOCATION_NAME: t.string,
});

export const putWrapper = new APIWrapper<
	typeof resultValidator,
	t.TypeOf<typeof classLocationValidator>,
	null
>({
	path,
	type: HttpMethod.POST,
	resultValidator,
});
