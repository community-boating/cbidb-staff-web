import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { DateTime, OptionalDate, OptionalNumber, OptionalString } from 'util/OptionalTypeValidators';
import { flagEnumValidator } from './flag-color';
import { signupTypeValidator } from './ap-class-sessions';

const scanCardMembershipValidator = t.type({
	assignId: t.number,
	membershipTypeId: t.number,
	startDate: OptionalDate,
	expirationDate: OptionalDate,
	discountName: OptionalString,
	isDiscountFrozen: t.boolean,
	hasGuestPrivs: t.boolean,
	programId: OptionalNumber
})

const scanCardRatingValidator = t.type({
	ratingId: t.number,
	programId: t.number,
	ratingName: t.string,
	status: t.string // Y | F
})

const maxFlagPerBoatValidator = t.type({
	boatId: t.number,
	programId: t.number,
	maxFlag: flagEnumValidator
})

const classSignupTodayValidator = t.type({
	instanceId: t.number,
	personId: t.number,
	sequence: t.number,
	signupDatetime: DateTime,
	signupId: t.number,
	signupType: signupTypeValidator
})

export const scanCardValidator = t.type({
	personId: t.number,
	cardNumber: t.string,
	nameFirst: t.string,
	nameLast: t.string,
	bannerComment: OptionalString,
	specialNeeds: OptionalString,
	activeMemberships: t.array(scanCardMembershipValidator),
	personRatings: t.array(scanCardRatingValidator),
	maxBoatFlags: t.array(maxFlagPerBoatValidator),
	apClassSignupsToday: t.array(classSignupTodayValidator),
})

export type ScannedPersonType = t.TypeOf<typeof scanCardValidator>;

export type ScannedCrewType = ScannedPersonType[];

const path = "/staff/dockhouse/scan-card"

export const getWrapper = (cardNumber: string) => new APIWrapper({
	path: path + "?cardNumber=" + cardNumber,
	type: HttpMethod.GET,
	resultValidator: scanCardValidator
})
