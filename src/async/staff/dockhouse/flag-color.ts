import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { DateTime, EnumType, OptionalNumber } from 'util/OptionalTypeValidators';

export enum FlagColor {
	RED="R",
	YELLOW = "Y",
	GREEN = "G",
    BLACK = "C"
}

export const flagEnumValidator = EnumType("message.priority", FlagColor);

const putFlagValidator = t.type({
    flagColor: flagEnumValidator
})

const path = "/staff/dockhouse/dh-globals"

export const postWrapper = new APIWrapper({
	path: path ,
	type: HttpMethod.POST,
	resultValidator: t.string,
    postBodyValidator: putFlagValidator,
	permissions: []
})
