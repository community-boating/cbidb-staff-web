import * as t from 'io-ts';
import { OptionalNumber, OptionalDateTime, DateTime, OptionalString, makeOptional } from 'util/OptionalTypeValidators';

export const path = "/staff/rest/ap-class-sessions/today"

/**
 * !!!!!!!!!!!!
 * This file is AUTO-GENERATED by cbidb-schema
 * Do not manually alter this file, or your changes will be lost
 * !!!!!!!!!!!!
 */
export const responseSuccessValidator = t.array(t.type({
	sessionId: t.number,
	instanceId: t.number,
	headcount: OptionalNumber,
	cancelledDatetime: OptionalDateTime,
	sessionDatetime: DateTime,
	sessionLength: t.number,
	$$apClassInstance: t.type({
		instanceId: t.number,
		cancelledDatetime: OptionalDateTime,
		signupsStartOverride: OptionalDateTime,
		signupMin: OptionalNumber,
		price: OptionalNumber,
		signupMax: OptionalNumber,
		formatId: t.number,
		hideOnline: t.boolean,
		cancelByOverride: OptionalDateTime,
		locationString: OptionalString,
		$$apClassSignups: t.array(t.type({
			instanceId: t.number,
			discountInstanceId: OptionalNumber,
			voidedOnline: t.boolean,
			personId: t.number,
			orderId: OptionalNumber,
			price: OptionalNumber,
			signupId: t.number,
			closeId: OptionalNumber,
			sequence: t.number,
			paymentMedium: OptionalString,
			ccTransNum: OptionalString,
			paymentLocation: OptionalString,
			voidCloseId: OptionalNumber,
			signupType: t.string,
			signupNote: OptionalString,
			signupDatetime: DateTime,
			$$person: t.type({
				personId: t.number,
				nameFirst: OptionalString,
				nameLast: OptionalString,
			}),
			$$apClassWaitlistResult: makeOptional(t.type({
				wlResult: t.string,
				foVmDatetime: OptionalDateTime,
				offerExpDatetime: OptionalDateTime,
				signupId: t.number,
				foAlertDatetime: OptionalDateTime,
			})),
		})),
	}),
}))
