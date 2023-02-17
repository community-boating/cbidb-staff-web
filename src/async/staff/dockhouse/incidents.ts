import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalDateTime, OptionalEnumType, OptionalNumber, OptionalString } from 'util/OptionalTypeValidators';

export enum IncidentTypes{
    CAPSIZE = "CAPSIZE", ASSIST="ASSIST", RUNAGROUND="RUNAGROUND", OTHER='OTHER'
}

export const incidentTypeValidator = OptionalEnumType("incidentType", IncidentTypes);

export enum IncidentStatusTypes{
    INPUT="INPUT",PENDING="PENDING",ASSIGNED="ASSIGNED",ARRIVED="ARRIVED",CLEAR="CLEAR",REPORT_TO_FOLLOW="REPORT_TO_FOLLOW",COMPLETE="COMPLETE"
}

export const incidentStatusTypeValidator = OptionalEnumType("incidentStatusType", IncidentStatusTypes);

const incidentValidator = t.type({
    id: t.number,
    createdBy: t.number,
    createdTime: OptionalDateTime,
    statusRelationship: t.string,
    location: OptionalString,
    locationN: OptionalNumber,
    locationW: OptionalNumber,
    type: incidentTypeValidator,
    subtype: OptionalString,
    assignedResourcePrimary: OptionalString,
    assignedResourcesOther: OptionalString,//t.array(t.string),
    currentPeople: t.array(t.number), //Person Ids
    associatedSignouts: t.array(t.number), //Signout Ids
    priority: OptionalString,
    status: incidentStatusTypeValidator,
    received: OptionalString,
    description: t.string
});

//get classes,
//get instructors
//set instructor
//set location
//get locations?
//add person

//grant rating

export const incidentsValidator = t.array(incidentValidator);

const path = "/rest/incidents"

export type IncidentType = t.TypeOf<typeof incidentValidator>;

export const getWrapper = new APIWrapper({
	path: path,
	type: HttpMethod.GET,
	resultValidator: incidentsValidator,
    permissions: []
})
