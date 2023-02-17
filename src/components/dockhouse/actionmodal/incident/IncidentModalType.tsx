import { SignoutsTablesState } from "async/staff/dockhouse/signouts"
import { ReactNode } from "react"
import { Action } from "../ActionModalProps"
import IncidentModal from "./IncidentModal"
import * as React from 'react';
import { IncidentType } from "async/staff/dockhouse/incidents";
import * as moment from "moment";
import { option } from "fp-ts";

export type IncidentModalType = {
    currentIncident: IncidentType
}

export class ActionEditIncident extends Action<IncidentModalType, {}>{
    constructor(currentIncident: IncidentType){
        super();
        this.modeInfo = {
            currentIncident: currentIncident
        }
    }
    createModalContent(info: IncidentModalType): ReactNode {
        return <IncidentModal {...info}/>
    }
}

export class ActionCreateIncident extends Action<IncidentModalType, {}>{
    constructor(){
        super();
        this.modeInfo = {
            currentIncident: {
                id: -1,
                createdBy: -1,
                createdTime: option.some(moment()),
                statusRelationship: "",
                location: option.none,
                locationN: option.none,
                locationW: option.none,
                type: option.none,
                subtype: option.none,
                status: option.none,
                priority: "",
                received: option.none,
                assignedResourcePrimary: option.none,
                assignedResourcesOther: [],
                currentPeople: [],
                associatedSignouts: [],
                description: ""
            }
        }
    }
    createModalContent(info: IncidentModalType): ReactNode {
        return <IncidentModal {...info}/>
    }
}