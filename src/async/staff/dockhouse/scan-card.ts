import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from 'util/OptionalTypeValidators';

const scanCardMembershipValidator = t.type({
	assignId: t.number,
	membershipTypeId: t.number,
	startDate: OptionalString,
	expirationDate: OptionalString,
	discountName: OptionalString,
	isDiscountFrozen: t.boolean,
	hasGuestPrivs: t.boolean
})

const scanCardRatingValidator = t.type({
	assignId: t.number,
	membershipTypeId: t.number,
	startDate: OptionalString,
	expirationDate: OptionalString,
	discountName: OptionalString,
	isDiscountFrozen: t.boolean,
	hasGuestPrivs: t.boolean
})

export const scanCardValidator = t.type({
	personId: t.number,
	cardNumber: t.string,
	nameFirst: t.string,
	nameLast: t.string,
	bannerComment: OptionalString,
	specialNeeds: OptionalString,
	activeMemberships: t.array(scanCardMembershipValidator),
	personsRatings: t.array(scanCardRatingValidator)
})

const path = "/staff/dockhouse/scan-card"

export const getWrapper = (cardNumber: string) => new APIWrapper({
	path: path + "?cardNumber=" + cardNumber,
	type: HttpMethod.GET,
	resultValidator: scanCardValidator
})
