import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { DateTime } from 'util/OptionalTypeValidators';

const announcementValidator = t.type({
	message: t.string,
	priority: t.string
})

const flagChangeValidator = t.type({
	flag: t.string,
	changeDatetime: DateTime,
})

export const dhGlobalsValidator = t.type({
	serverDateTime: DateTime,
	sunsetTime: DateTime,
	windSpeedAvg: t.number,
	winDir: t.string,
	announcements: t.array(announcementValidator),
	flagChanges: t.array(flagChangeValidator)
})

export type DHGlobals = t.TypeOf<typeof dhGlobalsValidator>;

const path = "/staff/dockhouse/dh-globals"

export const getWrapper = new APIWrapper({
	path: path ,
	type: HttpMethod.GET,
	resultValidator: dhGlobalsValidator
})
