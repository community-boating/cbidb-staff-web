import * as t from 'io-ts';
import { OptionalString } from 'util/OptionalTypeValidators';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const accessProfileValidator = t.type({
	accessProfileId: t.number,
	name: t.string,
	description: OptionalString,
	displayOrder: t.number
});

export const validator = t.array(accessProfileValidator);

const path = "/rest/access-profiles";

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
});
