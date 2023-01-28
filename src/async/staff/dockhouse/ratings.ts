import { OptionalNumber } from "util/OptionalTypeValidators";
import * as t from "io-ts";
import APIWrapper from "../../../core/APIWrapper";
import { HttpMethod } from "../../../core/HttpMethod";
import { boatsValidator, programsValidator, pathGetRatings } from "./signouts";


export const ratingValidator = t.type({
	ratingName: t.string,
	$$boats: t.array(boatsValidator),
	$$programs: t.array(programsValidator),
	ratingId: t.number,
	overriddenBy: OptionalNumber
});

export const ratingsValidator = t.array(ratingValidator);

export type RatingsType = t.TypeOf<typeof ratingsValidator>;

export const getRatings = new APIWrapper({
	path: pathGetRatings,
	type: HttpMethod.GET,
	resultValidator: ratingsValidator,
	permissions: []
});
