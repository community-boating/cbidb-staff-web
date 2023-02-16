import { SignoutsTablesState } from "async/staff/dockhouse/signouts"
import { ReactNode } from "react"
import { Action } from "../ActionModalProps"
import RentalsModal from "./RentalsModal"
import * as React from 'react';

export type RentalsType = {
    rentedSignouts: SignoutsTablesState
}

export class RentalsAction extends Action<RentalsType, {}>{
    constructor(rentedSignouts: SignoutsTablesState){
        super();
        this.modeInfo = {
            rentedSignouts: rentedSignouts
        }
    }
    createModalContent(info: RentalsType): ReactNode {
        return <RentalsModal {...info}/>
    }
}