import * as t from 'io-ts';
import { OptionalString, OptionalDateTime } from 'util/OptionalTypeValidators';

export const path = "/staff/dockhouse/scan-card"

/**
 * !!!!!!!!!!!!
 * This file is AUTO-GENERATED by cbidb-schema
 * Do not manually alter this file, or your changes will be lost
 * !!!!!!!!!!!!
 */

export const responseSuccessValidator = t.type({
	personId: t.number,
	cardNumber: t.string,
	nameFirst: OptionalString,
	nameLast: OptionalString,
	bannerComment: OptionalString,
	specialNeeds: OptionalString,
	signoutBlockReason: OptionalString,
	activeMemberships: t.array(t.type({
		assignId: t.number,
		membershipTypeId: t.number,
		startDate: OptionalDateTime,
		expirationDate: OptionalDateTime,
		discountName: OptionalString,
		isDiscountFrozen: t.boolean,
		hasGuestPrivs: t.boolean,
		programId: t.any,
	})),
	personRatings: t.array(t.type({
		ratingId: t.number,
		programId: t.number,
		ratingName: t.string,
		status: t.string,
	})),
	apClassSignupsToday: t.array(t.type({
		signupId: t.number,
		instanceId: t.number,
		personId: t.number,
		signupType: t.string,
		signupDatetime: t.string,
		sequence: t.number,
	})),
	jpClassSignupsToday: t.array(t.type({
		signupId: t.number,
		instanceId: t.number,
		personId: t.number,
		signupType: t.string,
		signupDatetime: t.string,
		sequence: t.number,
	})),
	maxBoatFlags: t.array(t.type({
		boatId: t.number,
		programId: t.number,
		maxFlag: t.string,
	})),
})