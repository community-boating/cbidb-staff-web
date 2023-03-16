import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import {responseSuccessValidator} from "models/api-generated/staff/rest/ap-class-sessions/today/get"

// const apClassWaitListValidator = t.type({
// 	"wlResult": t.any,
// 	"foVmDatetime": t.any,
// 	"offerExpDatetime": t.any,
// 	"signupId": t.number,
// 	"foAlertDatetime": t.any
// })

export enum SignupType{
    ACTIVE="E",
    WAITLIST="W"
}

// export const signupTypeValidator = EnumType("signupType", SignupType);

// const apClassSignupValidator = t.type({
//     instanceId: t.number,
//     discountInstanceId: OptionalNumber,
//     voidedOnline: t.boolean,
//     $$apClassWaitlistResult: t.any,//apClassWaitListValidator,
//     personId: t.number,
//     orderId: OptionalNumber,
//     price: OptionalNumber,
//     signupId:  t.number,
//     $$person: t.type({
//         personId:  t.number,
//         nameFirst: t.string,
//         nameLast: t.string
//     }),
//     closeId: OptionalNumber,
//     sequence: t.number,
//     paymentMedium: OptionalString,
//     ccTransNum: OptionalString,
//     paymentLocation: OptionalString,
//     voidCloseId: OptionalNumber,
//     signupType: signupTypeValidator,
//     signupNote: OptionalString,
//     signupDatetime: DateTime
// })

// const apClassSessionBase = {
// 	"instanceId": t.number,
// 	"sessionId": t.number,
// 	"cancelledDateTime": OptionalString,
// 	"sessionDateTime": DateTime,
// 	"headcount": OptionalNumber,
// 	"sessionLength": t.number,
// }

// const apClassInstanceBase = {
//     "instanceId": t.number,
// 	"cancelledDatetime": OptionalString,
// 	"signupsStartOverride": OptionalString,
// 	"signupMin": OptionalNumber,
// 	"price": OptionalNumber,
// 	"signupMax": OptionalNumber,
// 	"formatId": t.number,
// 	"hideOnline": t.boolean,
// 	"cancelByOverride": OptionalString,
// 	"locationString": OptionalString
// }

// const apClassInstanceValidator = t.type({
// 	...apClassInstanceBase,
// 	//$$apClassSignups: t.array(apClassSignupValidator)
// })

// const apClassSessionValidator = t.type({
//     ...apClassSessionBase,
// 	$$apClassInstance: apClassInstanceValidator
// })

// const allApClassSessionValidator = t.type(apClassSessionBase);

// const allApClassInstanceValidator = t.type({
//     ...apClassInstanceBase,
//     //$$apClassSessions: t.array(allApClassSessionValidator)
// })

// const apClassInstanceBaseValidator = t.type(apClassInstanceBase);
// const apClassSessionBaseValidator = t.type(apClassSessionBase);

// export type ApClassInstance = t.TypeOf<typeof apClassInstanceValidator>
// export type ApClassSession = t.TypeOf<typeof apClassSessionValidator>
// export type ApClassSignup = t.TypeOf<typeof apClassSignupValidator>

// export type ApClassInstanceWithSignups = t.TypeOf<typeof apClassInstanceValidator>

type ApClassSessions = t.TypeOf<typeof responseSuccessValidator>
export type ApClassSession = ApClassSessions[number]
export type ApClassInstance =  ApClassSession['$$apClassInstance']
export type ApClassSignup = ApClassInstance['$$apClassSignups'][number]

const path = "/rest/ap-class-sessions/today"

const pathAll = "/rest/ap-class-instances/this-season"

export const getAllWrapper = new APIWrapper({
	permissions: [],
	path: pathAll,
	type: HttpMethod.GET,
	resultValidator: responseSuccessValidator,
})

export const getWrapper = new APIWrapper({
	permissions: [],
	path: path,
	type: HttpMethod.GET,
	resultValidator: responseSuccessValidator,
})