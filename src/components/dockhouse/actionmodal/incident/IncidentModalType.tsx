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

var lowestId = -1;

export class ActionCreateIncident extends Action<IncidentModalType, {}>{
    constructor(type: option.Option<IncidentTypes> = option.none){
        super();
        this.modeInfo = {
            currentIncident: {
                id: lowestId,
                createdBy: -1,
                createdTime: option.some(moment()),
                statusRelationship: "",
                location: option.none,
                locationN: option.none,
                locationW: option.none,
                type: type,
                subtype: option.none,
                status: option.some(IncidentStatusTypes.PENDING),
                priority: option.none,
                received: option.none,
                assignedResourcePrimary: option.none,
                assignedResourcesOther: option.none,//[],
                currentPeople: [],
                associatedSignouts: [],
                description: ""
            },
            wasNew: true
        }
        lowestId--;
    }
    createModalContent(info: IncidentModalType): ReactNode {
        return <IncidentModal {...info}/>
    }
}