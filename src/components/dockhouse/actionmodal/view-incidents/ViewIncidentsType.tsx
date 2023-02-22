import { ReactNode } from "react"
import { Action } from "../ActionModalProps"
import * as React from 'react';
import {IncidentType } from "async/staff/dockhouse/incidents";
import ViewIncidentsModal from "./ViewIncidentsModal";

export type ViewIncidentsType = {
}

export class ActionViewIncidents extends Action<ViewIncidentsType, {}>{
    constructor(){
        super();
        this.modeInfo = {
        }
    }
    createModalContent(info: ViewIncidentsType): ReactNode {
        return <ViewIncidentsModal {...info}/>
    }
}