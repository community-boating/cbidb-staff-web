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

function subtypeWithPriority(subtype: IncidentSubTypes, priority: number){
    return {
        subtype,
        priority
    }
}

export const incidentSubTypeMapping = {
    [IncidentTypes.CAPSIZE]: [subtypeWithPriority(IncidentSubTypes.GENERAL,4), subtypeWithPriority(IncidentSubTypes.TURTLE,4)],
    [IncidentTypes.RUNAGROUND]: [subtypeWithPriority(IncidentSubTypes.GENERAL,5)],
    [IncidentTypes.VESSEL_ASSIST]: [subtypeWithPriority(IncidentSubTypes.GENERAL,4), subtypeWithPriority(IncidentSubTypes.TOW,5), subtypeWithPriority(IncidentSubTypes.STUCK_IN_BRIDGE,5), subtypeWithPriority(IncidentSubTypes.STUCK_IN_MARINA,4)],
    [IncidentTypes.PUBLIC_ASSIST]: [subtypeWithPriority(IncidentSubTypes.GENERAL,6), subtypeWithPriority(IncidentSubTypes.STANDBY,7), subtypeWithPriority(IncidentSubTypes.CRCK, 5), subtypeWithPriority(IncidentSubTypes.MIT, 5), subtypeWithPriority(IncidentSubTypes.HARVARD, 5), 
        subtypeWithPriority(IncidentSubTypes.OTHER_BOARHOUSE, 5), subtypeWithPriority(IncidentSubTypes.BFD, 2), subtypeWithPriority(IncidentSubTypes.CFD, 2), subtypeWithPriority(IncidentSubTypes.STATE_POLICE, 2), subtypeWithPriority(IncidentSubTypes.USCG, 2), subtypeWithPriority(IncidentSubTypes.OTHER_PUBLIC_SAFETY, 2)],
    [IncidentTypes.WATER_RESCUE]: [subtypeWithPriority(IncidentSubTypes.GENERAL, 4), subtypeWithPriority(IncidentSubTypes.MAN_OVERBOARD, 4), subtypeWithPriority(IncidentSubTypes.ENTRAPMENT, 1)],
    [IncidentTypes.MEDICAl]: [subtypeWithPriority(IncidentSubTypes.GENERAL, 3), subtypeWithPriority(IncidentSubTypes.INJURY, 2), subtypeWithPriority(IncidentSubTypes.HEAD_INJURY, 2), subtypeWithPriority(IncidentSubTypes.UNCONSCIOUS, 1), subtypeWithPriority(IncidentSubTypes.TRAUMA, 1), subtypeWithPriority(IncidentSubTypes.DROWNING, 1), subtypeWithPriority(IncidentSubTypes.SEIZURE, 1), subtypeWithPriority(IncidentSubTypes.ALLERGIC_REACTION, 1)],
    [IncidentTypes.SERVICE]: [subtypeWithPriority(IncidentSubTypes.GENERAL, 8), subtypeWithPriority(IncidentSubTypes.OUTBOARD, 8), subtypeWithPriority(IncidentSubTypes.INBOARD,7), subtypeWithPriority(IncidentSubTypes.SPECIAL_PURPOSE,6), subtypeWithPriority(IncidentSubTypes.RIVER_CHECK,8), subtypeWithPriority(IncidentSubTypes.LIFE_JACKET_INSPECTION,8)]
}

export const incidentTypeValidator = OptionalEnumType("incidentType", IncidentTypes);

export enum IncidentStatusTypes{
    INPUT="INPUT",PENDING="PENDING",ASSIGNED="ASSIGNED",ARRIVED="ARRIVED",CLEAR="CLEAR",REPORT_TO_FOLLOW="REPORT_TO_FOLLOW",COMPLETE="COMPLETE"
}

export const incidentStatusTypeValidator = OptionalEnumType("incidentStatusType", IncidentStatusTypes);

export const incidentSubTypeValidator = OptionalEnumType("incidentStatusType", IncidentSubTypes);

const incidentValidator = t.type({
    id: t.number,
    createdBy: t.number,
    createdTime: OptionalDateTime,
    statusRelationship: t.string,
    location: OptionalString,
    locationN: OptionalNumber,
    locationW: OptionalNumber,
    type: incidentTypeValidator,
    subtype: incidentSubTypeValidator,
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
