import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { EnumType } from 'util/OptionalTypeValidators';

export enum FlagColor {
	RED="R",
	YELLOW = "Y",
	GREEN = "G",
    BLACK = "C"
}

export const flagEnumValidator = EnumType("flagColor", FlagColor);

const putFlagValidator = t.type({
    flagColor: flagEnumValidator
})

export const allFlags = Object.values(FlagColor);

export function getFlagColor(color: string): FlagColor{
    const found = allFlags.find((a) => a == color);
    return (found != undefined) ? found : FlagColor.BLACK;
}

const path = "/staff/dockhouse/put-flag-change"

export const postWrapper = new APIWrapper({
	path: path,
	type: HttpMethod.POST,
	resultValidator: t.string,
    postBodyValidator: putFlagValidator,
	permissions: []
})
