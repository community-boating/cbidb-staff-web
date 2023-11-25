import * as t from 'io-ts';
import { makeOptionalPK, OptionalNumber } from 'util/OptionalTypeValidators';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const classInstructorValidator = t.type({
	instructorId: t.number,
	nameFirst: t.string,
	nameLast: t.string,
});

export const validator = t.array(classInstructorValidator);

const path = "/rest/class-instructor";

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
});

const resultValidator = t.type({
	instructorId: t.number
})

export const putWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator: makeOptionalPK(classInstructorValidator, "instructorId"),
	resultValidator,
});
