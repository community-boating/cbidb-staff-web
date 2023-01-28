import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalNumber, OptionalString } from 'util/OptionalTypeValidators';

export const grantRatingsValidator = t.type({
	instructor: t.string,
	programId: t.number,
	personIds: t.array(t.number),
	ratingIds: t.array(t.number),
})

const path = "/staff/dockhouse/grant-ratings"

export const postWrapper = new APIWrapper({
	path: path,
	type: HttpMethod.POST,
	resultValidator: t.any,
	postBodyValidator: grantRatingsValidator
})