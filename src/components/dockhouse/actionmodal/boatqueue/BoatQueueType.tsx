import { SignoutsTablesState } from "async/staff/dockhouse/signouts"
import { ReactNode } from "react"
import { Action } from "../ActionModalProps"
import BoatQueueModal from "./BoatQueueModal"
import * as React from 'react';

export type BoatQueueType = {
    boatQueueSignouts: SignoutsTablesState
}

export class BoatQueueAction extends Action<BoatQueueType, {}>{
    constructor(boatQueueSignouts: SignoutsTablesState){
        super();
        this.modeInfo = {
            boatQueueSignouts: boatQueueSignouts
        }
    }
    createModalContent(info: BoatQueueType): ReactNode {
        return <BoatQueueModal {...info}/>
    }
}