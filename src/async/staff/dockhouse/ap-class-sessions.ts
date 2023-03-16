import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import {responseSuccessValidator} from "models/api-generated/staff/rest/ap-class-sessions/today/get"

export enum SignupType{
    ACTIVE="E",
    WAITLIST="W"
}

type ApClassSessions = t.TypeOf<typeof responseSuccessValidator>
export type ApClassSession = ApClassSessions[number]
export type ApClassInstance =  ApClassSession['$$apClassInstance']
export type ApClassSignup = ApClassInstance['$$apClassSignups'][number]

const path = "/rest/ap-class-sessions/today"

const pathAll = "/rest/ap-class-instances/this-season"

export const getAllWrapper = new APIWrapper({
	permissions: [],
	path: pathAll,
	type: HttpMethod.GET,
	resultValidator: responseSuccessValidator,
})

export const getWrapper = new APIWrapper({
	permissions: [],
	path: path,
	type: HttpMethod.GET,
	resultValidator: responseSuccessValidator,
})
