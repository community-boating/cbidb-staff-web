import { OptionalNumber, OptionalString } from "@util/OptionalTypeValidators";
import * as t from "io-ts";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

const path = "/rest/dock-report"

export const dockReportStaffValidator = t.type({
	dockReportStaffId: t.number,
	dockReportId: t.number,
	dockmasterOnDuty: t.boolean,
	staffName: t.string,
	timeIn: t.string,
	timeOut: t.string
});

export const dockReportApClassValidator = t.type({
	dockReportApClassId: t.number,
	dockReportId: t.number,
	apInstanceId: OptionalNumber,
	className: t.string,
	classDatetime: t.string,
	location: OptionalString,
	instructor: OptionalString,
	attend: OptionalNumber
})

export const dockReportUapApptValidator = t.type({
	dockReportApptId: t.number,
	dockReportId: t.number,
	apptDatetime: t.string,
	apptType: t.string,
	participantName: t.string,
	boatTypeId: t.number,
	instructorName: OptionalString
})

export const dockReportHullCountValidator = t.type({
	dockReportHullCtId: t.number,
	dockReportId: t.number,
	hullType: t.string,
	inService: t.number,
	staffTally: OptionalNumber
})

export const dockReportWeatherValidator = t.type({
	weatherId: t.number,
	dockReportId: t.number,
	weatherDatetime: t.string,
	temp: t.number,
	weatherSummary: t.string,
	windDir: t.string,
	windSpeedKts: t.number,
	restrictions: t.string
})

export const dockReportValidator = t.type({
	dockReportId: t.number,
	reportDate: t.string,
	sunsetDatetime: OptionalString,
	incidentsNotes: OptionalString,
	announcements: OptionalString,
	semiPermanentRestrictions: OptionalString,
	staff: t.array(dockReportStaffValidator),
	apClasses: t.array(dockReportApClassValidator),
	uapAppts: t.array(dockReportUapApptValidator),
	hullCounts: t.array(dockReportHullCountValidator),
	weather: t.array(dockReportWeatherValidator)
})


export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: dockReportValidator,
});


export const postWrapper = new APIWrapper<
	typeof dockReportValidator,
	t.TypeOf<typeof dockReportValidator>,
	null
>({
	path,
	type: HttpMethod.POST,
	resultValidator: dockReportValidator,
});
