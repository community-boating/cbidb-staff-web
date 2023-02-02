import * as t from 'io-ts';
import { makeOptionalPK, OptionalNumber } from 'util/OptionalTypeValidators';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const classInstructorValidator = t.type({
	INSTRUCTOR_ID: t.number,
	NAME_FIRST: t.string,
	NAME_LAST: t.string,
});

export const validator = t.array(classInstructorValidator);

export type InstructorType = t.TypeOf<typeof classInstructorValidator>;

const path = "/rest/class-instructor";

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
	permissions: []
});

const resultValidator = t.type({
	INSTRUCTOR_ID: t.number
})

export const putWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator: makeOptionalPK(classInstructorValidator, "INSTRUCTOR_ID"),
	resultValidator,
});
