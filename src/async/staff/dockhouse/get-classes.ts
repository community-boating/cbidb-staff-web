import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { Date, DateTime, EnumType, OptionalDateTime, OptionalEnumType, OptionalNumber, OptionalString } from 'util/OptionalTypeValidators';

const sessionValidator = t.type({
	sessionId: t.number,
	instanceId: t.number,
    headcount: OptionalNumber,
	sessionDateTime: DateTime,
    cancelledDateTime: OptionalDateTime,
	sessionLength: t.number// Hours?
});

export enum SignupType{
    ACTIVE="E",
    WAITLIST="W"
}

export const signupTypeValidator = EnumType("signupType", SignupType);

export const signupValidator = t.type({
    $$person: t.type({
        personId: t.number,
        nameFirst: t.string,
        nameLast: t.string
    }),
    instanceId: t.number,
    signupId: t.number,
    signupType: signupTypeValidator,
    signupDatetime: DateTime,
    personId: t.number
});

export const classValidator = t.type({
	instanceId: t.number,
	formatId: t.number,
    hideOnline: t.boolean,
	$$apClassSessions: t.array(sessionValidator),
    $$apClassSignups: t.array(signupValidator),
    locationString: OptionalString,
    instructorId: OptionalNumber,
    signupMax: t.number,
    signupMin: t.number,
});

export type GetClassesParams = {
    programId: number
    startTime?: moment.Moment
    endTime?: moment.Moment
}

export type ClassType = t.TypeOf<typeof classValidator>;

export type SessionType = t.TypeOf<typeof sessionValidator>;

//get classes,
//get instructors
//set instructor
//set location
//get locations?
//add person

//grant rating

export const classesValidator = t.array(classValidator);

const path = "/rest/ap-class-instances/this-season"

export const getWrapper = new APIWrapper<typeof classesValidator, any, any, GetClassesParams>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: classesValidator,
    permissions: []
})
