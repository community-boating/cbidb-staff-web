import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalNumber, OptionalString } from 'util/OptionalTypeValidators';

const classFormatValidator = t.type({
    description: OptionalString,
    formatId: t.number,
    typeId: t.number
});

const classTypeValidator = t.type({
    $$apClassFormats: t.array(classFormatValidator),
    descLong: OptionalString,
    descShort: OptionalString,
    disallowIfOverkill: t.boolean,
    displayOrder: t.number,
    noSignup: t.boolean,
    ratingOverkill: OptionalNumber,
    ratingPrereq: OptionalNumber,
    signupMaxDefault: OptionalNumber,
    signupMinDefault: OptionalNumber,
    typeId: t.number,
    typeName: t.string
});

//get classes,
//get instructors
//set instructor
//set location
//get locations?
//add person

//grant rating

export const classTypesValidator = t.array(classTypeValidator);

const path = "/rest/ap-class-types"

export type ClassTypeType = t.TypeOf<typeof classTypeValidator>;

export const getWrapper = new APIWrapper({
	path: path,
	type: HttpMethod.GET,
	resultValidator: classTypesValidator
})
