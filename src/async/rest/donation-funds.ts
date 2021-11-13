import * as t from "io-ts";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

export const donationFundValidator = t.type({
	FUND_ID: t.number,
	FUND_NAME: t.string,
	LETTER_TEXT: t.union([t.string, t.null]),
	ACTIVE: t.boolean,
	DISPLAY_ORDER: t.union([t.number, t.null]),
	SHOW_IN_CHECKOUT: t.union([t.boolean, t.null]),
	PORTAL_DESCRIPTION: t.union([t.string, t.null]),
	IS_ENDOWMENT: t.union([t.boolean, t.null]),
});

export const validator = t.array(donationFundValidator);

const path = "/rest/donation-fund";

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
});

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
