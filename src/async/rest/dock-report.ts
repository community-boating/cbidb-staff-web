import { OptionalBoolean, OptionalNumber, OptionalString } from "@util/OptionalTypeValidators";
import * as t from "io-ts";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

const path = "/rest/dock-report"

export const dockReportStaffValidator = t.type({
	DOCK_REPORT_STAFF_ID: OptionalNumber,
	DOCK_REPORT_ID: OptionalNumber,
	DOCKMASTER_ON_DUTY: t.boolean,
	STAFF_NAME: t.string,
	TIME_IN: OptionalString,
	TIME_OUT: OptionalString,
});

export const dockReportApClassValidator = t.type({
	DOCK_REPORT_AP_CLASS_ID: OptionalNumber,
	DOCK_REPORT_ID: OptionalNumber,
	AP_INSTANCE_ID: OptionalNumber,
	CLASS_NAME: t.string,
	CLASS_DATETIME: t.string,
	LOCATION: OptionalString,
	INSTRUCTOR: OptionalString,
	ATTEND: OptionalNumber
})

export const dockReportUapApptValidator = t.type({
	DOCK_REPORT_APPT_ID: OptionalNumber,
	DOCK_REPORT_ID: OptionalNumber,
	APPT_DATETIME: OptionalString,
	APPT_TYPE: OptionalString,
	PARTICIPANT_NAME: t.string,
	BOAT_TYPE_ID: OptionalNumber,
	INSTRUCTOR_NAME: OptionalString,
	HOYER: OptionalBoolean,
})

export const dockReportHullCountValidator = t.type({
	DOCK_REPORT_HULL_CT_ID: OptionalNumber,
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
	WIND_SPEED_KTS_STEADY: OptionalNumber,
	WIND_SPEED_KTS_GUST: OptionalNumber,
	RESTRICTIONS: OptionalString
})

export const dockReportValidator = t.type({
	DOCK_REPORT_ID: OptionalNumber,
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


export const putDockReport = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator: dockReportValidator,
	resultValidator: dockReportValidator,
});
