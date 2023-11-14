import * as t from 'io-ts';
import { OptionalNumber, OptionalString, OptionalBoolean } from 'util/OptionalTypeValidators';

export const path = "/staff/rest/ap-class-types"

/**
 * !!!!!!!!!!!!
 * This file is AUTO-GENERATED by cbidb-schema
 * Do not manually alter this file, or your changes will be lost
 * !!!!!!!!!!!!
 */
export const responseSuccessValidator = t.array(t.type({
	typeId: t.number,
	typeName: t.string,
	ratingPrereq: OptionalNumber,
	classPrereq: OptionalNumber,
	ratingOverkill: OptionalNumber,
	displayOrder: t.number,
	descLong: t.string,
	descShort: OptionalString,
	classOverkill: OptionalNumber,
	noSignup: OptionalBoolean,
	priceDefault: OptionalNumber,
	signupMaxDefault: OptionalNumber,
	signupMinDefault: OptionalNumber,
	disallowIfOverkill: OptionalBoolean,
	$$apClassFormats: t.array(t.type({
		formatId: t.number,
		typeId: t.number,
		description: OptionalString,
		priceDefaultOverride: OptionalNumber,
		sessionCtDefault: t.number,
		sessionLengthDefault: t.number,
		signupMaxDefaultOverride: OptionalNumber,
		signupMinDefaultOverride: OptionalNumber,
	})),
}))
