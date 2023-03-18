import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { DateTime, EnumType, OptionalNumber } from 'util/OptionalTypeValidators';
import { flagEnumValidator } from './flag-color';

export enum MessagePriority {
	LOW = "L",
	MEDIUM = "M",
	HIGH = "H"
}

const MessageEnumValidator = EnumType("message.priority", MessagePriority);

const announcementValidator = t.type({
	message: t.string,
	priority: MessageEnumValidator
})

const flagChangeValidator = t.type({
	flag: flagEnumValidator,
	changeDatetime: DateTime,
})

export const dhGlobalsValidator = t.type({
	localTimeOffset: OptionalNumber,
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
	resultValidator: dhGlobalsValidator,
	permissions: []
})