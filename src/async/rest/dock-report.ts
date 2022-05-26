import { OptionalNumber, OptionalString } from "@util/OptionalTypeValidators";
import * as t from "io-ts";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

const path = "/rest/dock-report"

export const dockReportStaffValidator = t.type({
	DOCK_REPORT_STAFF_ID: t.number,
	DOCK_REPORT_ID: OptionalNumber,
	DOCKMASTER_ON_DUTY: t.boolean,
	STAFF_NAME: t.string,
	TIME_IN: t.string,
	TIME_OUT: t.string,
});

export const dockReportApClassValidator = t.type({
	DOCK_REPORT_AP_CLASS_ID: t.number,
	DOCK_REPORT_ID: OptionalNumber,
	AP_INSTANCE_ID: OptionalNumber,
	CLASS_NAME: OptionalString,
	CLASS_DATETIME: OptionalString,
	LOCATION: OptionalString,
	INSTRUCTOR: OptionalString,
	ATTEND: OptionalNumber
})

export const dockReportUapApptValidator = t.type({
	DOCK_REPORT_APPT_ID: t.number,
	DOCK_REPORT_ID: OptionalNumber,
	APPT_DATETIME: t.string,
	APPT_TYPE: t.string,
	PARTICIPANT_NAME: t.string,
	BOAT_TYPE_ID: t.number,
	INSTRUCTOR_NAME: t.string
})

export const dockReportHullCountValidator = t.type({
	DOCK_REPORT_HULL_CT_ID: t.number,
	DOCK_REPORT_ID: OptionalNumber,
	HULL_TYPE: t.string,
	IN_SERVICE: OptionalNumber,
	STAFF_TALLY: OptionalNumber
})

export const dockReportWeatherValidator = t.type({
	WEATHER_ID: OptionalNumber,
	DOCK_REPORT_ID: OptionalNumber,
	WEATHER_DATETIME: t.string,
	TEMP: OptionalNumber,
	WEATHER_SUMMARY: OptionalString,
	WIND_DIR: OptionalString,
	WIND_SPEED_KTS: OptionalNumber,
	RESTRICTIONS: OptionalString
})

export const dockReportValidator = t.type({
	DOCK_REPORT_ID: t.number,
	REPORT_DATE: t.string,
	SUNSET_DATETIME: OptionalString,
	INCIDENTS_NOTES: OptionalString,
	ANNOUNCEMENTS: OptionalString,
	SEMI_PERMANENT_RESTRICTIONS: OptionalString,
	dockstaff: t.array(dockReportStaffValidator),
	dockmasters: t.array(dockReportStaffValidator),
	apClasses: t.array(dockReportApClassValidator),
	uapAppts: t.array(dockReportUapApptValidator),
	hullCounts: t.array(dockReportHullCountValidator),
	weather: t.array(dockReportWeatherValidator)
})


export const getDockReport = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: dockReportValidator,
});


export const putDockReport = new APIWrapper<
	typeof dockReportValidator,
	t.TypeOf<typeof dockReportValidator>,
	null
>({
	path,
	type: HttpMethod.POST,
	resultValidator: dockReportValidator,
});
