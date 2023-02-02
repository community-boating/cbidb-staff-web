import APIWrapper from "core/APIWrapper";
import { HttpMethod } from "core/HttpMethod";
import * as t from "io-ts";
import { DateTime, OptionalString } from "util/OptionalTypeValidators";

const pathGetTestsToday = "/rest/tests-today";

export const testValidator = t.type({
	signoutId: t.number,
    personId: t.number,
    testResult: OptionalString,
    createdBy: t.number,
    createdOn: DateTime
});

export const testsValidator = t.array(testValidator);

export type TestType = t.TypeOf<typeof testValidator>;

export const getTestsToday = new APIWrapper({
	path:pathGetTestsToday,
	type: HttpMethod.GET,
	resultValidator: testsValidator,
	permissions: []
});