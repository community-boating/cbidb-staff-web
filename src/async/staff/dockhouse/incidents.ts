import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalDateTime, OptionalEnumType, OptionalNumber, OptionalString } from 'util/OptionalTypeValidators';

export enum IncidentTypes{
    CAPSIZE = "CAPSIZE", RUNAGROUND="RUNAGROUND",VESSEL_ASSIST="VESSEL_ASSIST",PUBLIC_ASSIST="PUBLIC_ASSIST",
    WATER_RESCUE='WATER_RESCUE',MEDICAl="MEDICAL",SERVICE="SERVICE"
}

export enum IncidentSubTypes{
    GENERAL,
    TURTLE,
    TOW,
    STUCK_IN_BRIDGE,
    STUCK_IN_MARINA,
    STANDBY,
    CRCK,
    MIT,
    HARVARD,
    OTHER_BOARHOUSE,
    BFD,
    CFD,
    STATE_POLICE,
    USCG,
    OTHER_PUBLIC_SAFETY,
    MAN_OVERBOARD,
    ENTRAPMENT,
    INJURY,
    HEAD_INJURY,
    UNCONSCIOUS,
    TRAUMA,
    DROWNING,
    SEIZURE,
    ALLERGIC_REACTION,
    OUTBOARD,
    INBOARD,
    SPECIAL_PURPOSE,
    RIVER_CHECK,
    LIFE_JACKET_INSPECTION
}

export const incidentSubTypeMapping = {
    [IncidentTypes.CAPSIZE]: [IncidentSubTypes.GENERAL, IncidentSubTypes.TURTLE],
    [IncidentTypes.RUNAGROUND]: [IncidentSubTypes.GENERAL],
    [IncidentTypes.VESSEL_ASSIST]: [IncidentSubTypes.GENERAL, IncidentSubTypes.TOW, IncidentSubTypes.STUCK_IN_BRIDGE, IncidentSubTypes.STUCK_IN_MARINA],
    [IncidentTypes.PUBLIC_ASSIST]: [IncidentSubTypes.GENERAL, IncidentSubTypes.STANDBY, IncidentSubTypes.CRCK, IncidentSubTypes.MIT, IncidentSubTypes.HARVARD, 
        IncidentSubTypes.OTHER_BOARHOUSE, IncidentSubTypes.BFD, IncidentSubTypes.CFD, IncidentSubTypes.STATE_POLICE, IncidentSubTypes.USCG, IncidentSubTypes.OTHER_PUBLIC_SAFETY],
    [IncidentTypes.WATER_RESCUE]: [IncidentSubTypes.GENERAL, IncidentSubTypes.MAN_OVERBOARD, IncidentSubTypes.ENTRAPMENT],
    [IncidentTypes.MEDICAl]: [IncidentSubTypes.GENERAL, IncidentSubTypes.INJURY, IncidentSubTypes.HEAD_INJURY, IncidentSubTypes.UNCONSCIOUS, IncidentSubTypes.TRAUMA, IncidentSubTypes.DROWNING, IncidentSubTypes.SEIZURE, IncidentSubTypes.ALLERGIC_REACTION],
    [IncidentTypes.SERVICE]: [IncidentSubTypes.GENERAL, IncidentSubTypes.OUTBOARD, IncidentSubTypes.INBOARD, IncidentSubTypes.SPECIAL_PURPOSE, IncidentSubTypes.RIVER_CHECK, IncidentSubTypes.LIFE_JACKET_INSPECTION]
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
