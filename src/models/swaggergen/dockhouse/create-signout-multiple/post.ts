import * as t from 'io-ts';
import { OptionalNumber, OptionalString, OptionalDateTime } from 'util/OptionalTypeValidators';

export const path = "/staff/dockhouse/create-signout-multiple"

/**
 * !!!!!!!!!!!!
 * This file is AUTO-GENERATED by cbidb-schema
 * Do not manually alter this file, or your changes will be lost
 * !!!!!!!!!!!!
 */
export const responseSuccessValidator = t.array(t.type({
	signoutId: t.number,
	personId: OptionalNumber,
	programId: t.number,
	boatId: t.number,
	signoutType: t.string,
	cardNum: OptionalString,
	sailNumber: OptionalString,
	hullNumber: OptionalString,
	testRatingId: OptionalNumber,
	testResult: OptionalString,
	isQueued: t.boolean,
	signoutDatetime: OptionalDateTime,
	$$crew: t.array(t.type({
		signoutId: t.number,
		personId: OptionalNumber,
		cardNum: OptionalString,
		startActive: OptionalDateTime,
	})),
	$$tests: t.array(t.type({
		signoutId: t.number,
		personId: t.number,
		ratingId: t.number,
	})),
}))

export const requestValidator = t.type({
	signouts: t.array(t.type({
		skipperPersonId: t.number,
		programId: t.number,
		skipperCardNumber: t.string,
		skipperTestRatingId: OptionalNumber,
		boatId: t.number,
		sailNumber: OptionalString,
		hullNumber: OptionalString,
		classSessionId: OptionalNumber,
		isRacing: t.boolean,
		dockmasterOverride: t.boolean,
		didInformKayakRules: t.boolean,
		signoutCrew: t.array(t.type({
			personId: t.number,
			cardNumber: t.string,
			testRatingId: OptionalNumber,
		})),
	})),
})
