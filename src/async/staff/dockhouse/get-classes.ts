import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const instructorValidator = t.type({
    instructorId: t.number,
    nameFirst: t.string,
    nameLast: t.string
})

export const classValidator = t.type({
	instructor: t.string,
	programId: t.number,
	personIds: t.array(t.number),
	ratingIds: t.array(t.number),
})

export type GetClassesParams = {
    programId: number,
    startTime?: moment.Moment,
    endTime?: moment.Moment
}

export const classesValidator = t.array(classValidator);

const path = "/staff/dockhouse/classes"

export const getWrapper = new APIWrapper<typeof classesValidator, any, any, GetClassesParams>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: classesValidator
})
