import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";


export const validator = t.type({
	programId: t.number,
	ratingsHtml: t.string
})

const path = "/staff/rating-html"

export const getWrapper = (personId: number) => new APIWrapper({
	path: path + "?personId=" + personId,
	type: HttpMethod.GET,
	resultValidator: t.array(validator),
})
