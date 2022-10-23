import * as t from "io-ts";
import { OptionalNumber, OptionalString } from "util/OptionalTypeValidators";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

export const personValidatorForApClassSignup = t.type({
	personId: t.number,
	nameFirst: OptionalString,
	nameLast: OptionalString,
})

export const apClassWaitListValidator = t.type({
	foAlertDatetime: OptionalString,
	foVmDatetime: OptionalString,
	offerExpDatetime: OptionalString,
	signupId: t.number,
	wlResult: t.string
})

export const apClassSignupValidator = t.type({
	$$apClassWaitlistResult: t.union([t.undefined, apClassWaitListValidator]),
	$$person: personValidatorForApClassSignup,
	signupId: t.number,
	instanceId: t.number,
	personId: t.number,
	orderId: OptionalNumber,
	signupDatetime: t.string,
	sequence: t.number,
	signupType: t.string,
	price: OptionalNumber,
	closeId: OptionalNumber,
	discountInstanceId: OptionalNumber,
	paymentMedium: OptionalString,
	ccTransNum: OptionalString,
	voidCloseId: OptionalNumber,
	signupNote: OptionalString,
	voidedOnline: t.boolean,
	paymentLocation: OptionalString,
})

export const apClassSessionValidator = t.type({
	cancelledDateTime: OptionalString,
	headcount: OptionalNumber,
	instanceId: t.number,
	sessionDateTime: t.string,
	sessionId: t.number,
	sessionLength: t.number,
})

export const apClassInstanceValidator = t.type({
	$$apClassSessions: t.array(apClassSessionValidator),
	$$apClassSignups: t.array(apClassSignupValidator),
	cancelByOverride: OptionalString,
	cancelledDatetime: OptionalString,
	formatId: t.number,
	hideOnline: t.boolean,
	instanceId: t.number,
	locationString: OptionalString,
	price: OptionalNumber,
	signupMax: OptionalNumber,
	signupMin: OptionalNumber,
	signupsStartOverride: OptionalString,
});

export type ApClassInstance = t.TypeOf<typeof apClassInstanceValidator>

const path = "/rest/ap-class-instances/this-season";

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: t.array(apClassInstanceValidator),
});
