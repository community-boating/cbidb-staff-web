import { ApiResult } from "@core/APIWrapperTypes";
import * as t from "io-ts";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

export const classLocationValidator = t.type({
	LOCATION_ID: t.number,
	LOCATION_NAME: t.string,
});

export const validator = t.array(classLocationValidator);

const path = "/rest/class-location";

// export const getWrapper = new APIWrapper({
// 	path,
// 	type: HttpMethod.GET,
// 	resultValidator: validator,
// });

export const getWrapper = (): Promise<
	ApiResult<t.TypeOf<typeof validator>>
> => {
	return Promise.resolve({
		type: "Success",
		success: [
			{
				LOCATION_ID: 984,
				LOCATION_NAME: "Just an example",
			},
		],
	} as ApiResult<t.TypeOf<typeof validator>>);
};

const resultValidator = t.type({
	LOCATION_ID: t.number,
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
