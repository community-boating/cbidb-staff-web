import APIWrapper from "core/APIWrapper";
import { HttpMethod } from "core/HttpMethod";
import * as t from "io-ts";
import { OptionalDateTime, OptionalEnumType } from "util/OptionalTypeValidators";

const pathGetAttendanceList = "/attendance";

export enum AttendanceEntry{
    HERE="HERE",ABSENT="ABSENT"
}

export const attendanceEntryValidator = OptionalEnumType("attendanceEntry", AttendanceEntry);

export const attendanceValidator = t.type({
	sessionId: t.number,
    instanceId: t.number,
    personId: t.number,
    entry: attendanceEntryValidator,
    time: OptionalDateTime
});

export const attendanceListValidator = t.array(attendanceValidator);

export type AttendanceType = t.TypeOf<typeof attendanceValidator>;

export const getAttendanceList = new APIWrapper({
	path:pathGetAttendanceList,
	type: HttpMethod.GET,
	resultValidator: attendanceListValidator,
	permissions: []
});