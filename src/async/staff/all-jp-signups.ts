import { makeOptional, OptionalNumber } from '@util/OptionalTypeValidators';
import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const typeValidator = t.type({
	DISPLAY_ORDER: t.number,
	TYPE_ID: t.number,
	TYPE_NAME: t.string,
});

export const sectionLookupValidator = t.type({
	SECTION_ID: t.number,
	SECTION_NAME: t.string,
	SVG_URL: t.string,
});

export const sectionValidator = t.type({
	INSTANCE_ID: t.number,
	LOOKUP_ID: t.number,
	SECTION_ID: t.number,
	"$$sectionLookup": sectionLookupValidator,
})

export const groupValidator = t.type({
	GROUP_ID: t.number,
	GROUP_NAME: t.string
});

export const instanceValidator = t.type({
	INSTANCE_ID: t.number,
	INSTRUCTOR_ID: OptionalNumber,
	LOCATION_ID: OptionalNumber,
	TYPE_ID: t.number,
	"$$jpClassType": typeValidator
});

export const personValidator = t.type({
	NAME_FIRST: t.string,
	NAME_LAST: t.string,
	PERSON_ID: t.number,
});

export const wlResultValidator = t.type({
	OFFER_EXP_DATETIME: t.string,
	SIGNUP_ID: t.number,
	WL_RESULT: t.string,
	statusString: t.string,
});

export const signupValidator = t.type({
	INSTANCE_ID: t.number,
	PERSON_ID: t.number,
	SIGNUP_DATETIME: t.string,
	SIGNUP_ID: t.number,
	SIGNUP_TYPE: t.string,
	SEQUENCE: t.number,
	GROUP_ID: OptionalNumber,
	"$$jpClassInstance": instanceValidator,
	"$$person": personValidator,
	"$$group": makeOptional(groupValidator, "group"),
	"$$jpClassWlResult": makeOptional(wlResultValidator, "wlResult"),
	"$$section": makeOptional(sectionValidator, "section"),
});

export const decoratedInstanceValidator = t.type({
	jpClassInstance: instanceValidator,
	firstSession: t.string,
	lastSession: t.string,
	week: t.number,
	spotsLeftHTML: t.string,
	sessionLength: t.number,
});

export const weekValidator = t.type({
	friday: t.string,
	monday: t.string,
	weekNumber: t.number,
	weekTitle: t.string,
});

export const staggerValidator = t.type({
	INSTANCE_ID: t.number,
	OCCUPANCY: t.number,
	STAGGER_DATE: t.string,
	STAGGER_ID: t.number,
});

export const validator = t.type({
	instances: t.array(decoratedInstanceValidator),
	signups: t.array(signupValidator),
	weeks: t.array(weekValidator),
	staggers: t.array(staggerValidator),
});

const path = "/staff/all-jp-signups";

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
});
