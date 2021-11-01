import { ApiResult } from "@core/APIWrapperTypes";
import * as t from "io-ts";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

export const donationFundValidator = t.type({
	FUND_ID: t.number,
	FUND_NAME: t.string,
});

export const validator = t.array(donationFundValidator);

const path = "/rest/donation-funds";

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
				FUND_ID: 123456,
				FUND_NAME: "Unrestricted Donation",
			},
			{
				FUND_ID: 7,
				FUND_NAME: "Junior Program Current Operations",
			},
		],
	} as ApiResult<t.TypeOf<typeof validator>>);
};

const resultValidator = t.type({
	FUND_ID: t.number,
});

export const putWrapper = new APIWrapper<
	typeof resultValidator,
	t.TypeOf<typeof donationFundValidator>,
	null
>({
	path,
	type: HttpMethod.POST,
	resultValidator,
});
