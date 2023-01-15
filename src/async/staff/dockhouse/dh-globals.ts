import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const announcementValidator = t.type({
	message: t.string,
	priority: t.string
})

const flagChangeValidator = t.type({
	flag: t.string,
	changeDatetime: t.string,
})

export const dhGlobalsValidator = t.type({
	serverDateTime: t.string,
	sunsetTime: t.string,
	windSpeedAvg: t.number,
	winDir: t.string,
	announcements: t.array(announcementValidator),
	flagChanges: t.array(flagChangeValidator)
})

const path = "/staff/dockhouse/dh-globals"

export const getWrapper = new APIWrapper({
	path: path ,
	type: HttpMethod.GET,
	resultValidator: dhGlobalsValidator
})
