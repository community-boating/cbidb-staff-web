import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalDateTime, OptionalNumber, OptionalString } from 'util/OptionalTypeValidators';

const incidentValidator = t.type({
    id: t.number,
    createdBy: t.number,
    createdTime: OptionalDateTime,
    statusRelationship: t.string,
    location: OptionalString,
    locationN: OptionalNumber,
    locationW: OptionalNumber,
    type: OptionalString,
    subtype: OptionalString,
    assignedResourcePrimary: OptionalString,
    assignedResourcesOther: t.array(t.string),
    currentPeople: t.array(t.number), //Person Ids
    associatedSignouts: t.array(t.number), //Signout Ids
    priority: t.string,
    status: OptionalString,
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
