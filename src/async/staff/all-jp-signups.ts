import { OptionalNumber } from '@util/OptionalTypeValidators';
import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const typeValidator = t.type({
	DISPLAY_ORDER: t.number,
	TYPE_ID: t.number,
	TYPE_NAME: t.string,
})

export const instanceValidator = t.type({
	INSTANCE_ID: t.number,
	INSTRUCTOR_ID: OptionalNumber,
	LOCATION_ID: OptionalNumber,
	TYPE_ID: t.number,
	"$$jpClassType": typeValidator
})

export const signupValidator = t.type({
	INSTANCE_ID: t.number,
	PERSON_ID: t.number,
	SIGNUP_DATETIME: t.string,
	SIGNUP_ID: t.number,
	SIGNUP_TYPE: t.string,
	"$$jpClassInstance": instanceValidator
})

export const decoratedInstanceValidator = t.type({
	jpClassInstance: instanceValidator,
	firstSession: t.string,
	lastSession: t.string,
	week: t.number
})

export const validator = t.type({
	instances: t.array(decoratedInstanceValidator),
	signups: t.array(signupValidator)
})

const path = "/staff/all-jp-signups"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
})
