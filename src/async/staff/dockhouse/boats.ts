import APIWrapper from "core/APIWrapper";
import { HttpMethod } from "core/HttpMethod";
import * as t from "io-ts";

const pathGetBoatTypes = "/rest/boat-types";

export const boatTypeValidator = t.type({
	maxCrew: t.number,
	boatName: t.string,
	minCrew: t.number,
	boatId: t.number,
	displayOrder: t.number,
	active: t.boolean
});

export const boatTypesValidator = t.array(boatTypeValidator);

export type BoatTypesType = t.TypeOf<typeof boatTypesValidator>;

export const getBoatTypes = new APIWrapper({
	path:pathGetBoatTypes,
	type: HttpMethod.GET,
	resultValidator: boatTypesValidator,
	permissions: []
});