import * as t from 'io-ts';
import { OptionalDateTime, OptionalNumber, OptionalBoolean, OptionalString, DateTime, makeOptional } from 'util/OptionalTypeValidators';

export const path = "/staff/rest/ap-class-instances/this-season"

/**
 * !!!!!!!!!!!!
 * This file is AUTO-GENERATED by cbidb-schema
 * Do not manually alter this file, or your changes will be lost
 * !!!!!!!!!!!!
 */
export const responseSuccessValidator = t.array(t.type({
	instanceId: t.number,
	cancelledDatetime: OptionalDateTime,
	signupsStartOverride: OptionalDateTime,
	signupMin: OptionalNumber,
	price: OptionalNumber,
	signupMax: OptionalNumber,
	formatId: t.number,
	hideOnline: OptionalBoolean,
	cancelByOverride: OptionalDateTime,
	locationString: OptionalString,
	doNotAutoCancel: OptionalBoolean,
	instructorId: OptionalNumber,
	$$apClassSessions: t.array(t.type({
		sessionId: t.number,
		instanceId: t.number,
		headcount: OptionalNumber,
		cancelledDatetime: OptionalDateTime,
		sessionDatetime: DateTime,
		sessionLength: t.number,
		isMakeup: OptionalBoolean,
	})),
	$$instructor: makeOptional(t.type({
		personId: t.number,
		nameFirst: OptionalString,
		nameLast: OptionalString,
	})),
}))