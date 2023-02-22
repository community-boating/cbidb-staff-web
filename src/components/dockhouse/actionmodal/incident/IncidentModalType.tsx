import { ReactNode } from "react"
import { Action } from "../ActionModalProps"
import IncidentModal from "./IncidentModal"
import * as React from 'react';
import { IncidentStatusTypes, IncidentType, IncidentTypes } from "async/staff/dockhouse/incidents";
import * as moment from "moment";
import { option } from "fp-ts";

export type IncidentModalType = {
    currentIncident: IncidentType,
    wasNew: boolean
}

export class ActionEditIncident extends Action<IncidentModalType, {}>{
    constructor(currentIncident: IncidentType){
        super();
        this.modeInfo = {
            currentIncident: currentIncident,
            wasNew: false
        }
    }
    createModalContent(info: IncidentModalType): ReactNode {
        return <IncidentModal {...info}/>
    }
}

var minId = -1;

export function createIncident(type: IncidentTypes): IncidentType{
    const a = {
        id: minId,
        createdBy: -1,
        createdTime: option.some(moment()),
        statusRelationship: "",
        location: option.none,
        locationN: option.none,
        locationW: option.none,
        type: option.some(type),
        subtype: option.none,
        status: option.some(IncidentStatusTypes.INPUT),
        priority: option.none,
        received: option.none,
        assignedResourcePrimary: option.none,
        assignedResourcesOther: option.none,//[],
        currentPeople: [],
        associatedSignouts: [],
        description: ""
    }
    minId--;
    return a;
}