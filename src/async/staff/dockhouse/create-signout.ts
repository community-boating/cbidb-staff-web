import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalNumber, OptionalString } from 'util/OptionalTypeValidators';

const createSignoutCrewValidator = t.type({
    personId: t.number,
    cardNumber: t.string,
    testRatingId: OptionalNumber
});

const createSignoutValidator = t.type({
    skipperPersonId: t.number,
    skipperCardNumber: t.string,
    skipperTestRatingId: OptionalNumber,
    boatId: t.number,
    sailNumber: OptionalString,
    hullNumber: OptionalString,
    classSessionid: OptionalNumber,
    isRacing: t.boolean,
    dockmasterOverride: t.boolean,
    didInformKayakRules: t.boolean,
    signoutCrew: t.array(createSignoutCrewValidator)
})

const path = "/staff/dockhouse/create-signout"

export const postWrapper = new APIWrapper({
	path: path,
	type: HttpMethod.POST,
	resultValidator: t.any,
    postBodyValidator: createSignoutValidator
})
