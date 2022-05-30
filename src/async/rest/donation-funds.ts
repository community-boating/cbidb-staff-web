import { OptionalNumber, OptionalString } from "@util/OptionalTypeValidators";
import * as t from "io-ts";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

export const donationFundValidator = t.type({
	FUND_ID: t.number,
	FUND_NAME: t.string,
	LETTER_TEXT: OptionalString,
	ACTIVE: t.boolean,
	DISPLAY_ORDER: OptionalNumber,
	SHOW_IN_CHECKOUT: t.boolean,
	PORTAL_DESCRIPTION: OptionalString,
	IS_ENDOWMENT: t.boolean,
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

export const putWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator: donationFundValidator,
	resultValidator,
});
