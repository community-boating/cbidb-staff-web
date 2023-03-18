import { ReactNode } from "react"
import { Action } from "../ActionModalProps"
import * as React from 'react';
import ViewIncidentsModal from "./ViewIncidentsModal";

export enum IncidentDLVType {
    PENDING,
    ASSIGNED,
    COMPLETED
}

export type ViewIncidentsType = {
    dlvType: IncidentDLVType
}

export class ActionViewIncidents extends Action<ViewIncidentsType, {}>{
    constructor(dlvType?: IncidentDLVType){
        super();
        this.modeInfo = {
            dlvType: dlvType
        }
    }
    createModalContent(info: ViewIncidentsType, state, setState, isDLV): ReactNode {
        return <ViewIncidentsModal isDLV={isDLV} dlvType={info.dlvType}/>
    }
}