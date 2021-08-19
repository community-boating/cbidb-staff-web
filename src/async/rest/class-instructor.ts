import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const classInstructorValidator = t.type({
	INSTRUCTOR_ID: t.number,
	NAME_FIRST: t.string,
	NAME_LAST: t.string,
})

export const validator = t.array(classInstructorValidator)

const path = "/rest/class-instructor"

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
})
