import { SignoutsTablesState } from "async/staff/dockhouse/signouts"
import { ReactNode } from "react"
import { Action, getInfo } from "../ActionModalProps"
import RentalsModal from "./RentalsModal"
import * as React from 'react';
import { SignoutsTodayContext } from "async/providers/SignoutsTodayProvider";

export type RentalsType = {
    rentedSignouts: SignoutsTablesState
}

export class RentalsAction extends Action<RentalsType, {}>{
    constructor(){
        super();
        this.modeInfo = () => {
            const signouts = React.useContext(SignoutsTodayContext);
            return {
                rentedSignouts: signouts.state
            }
        }
    }
    createModalContent(info: RentalsType, state, setState, isDLV): ReactNode {
        return <RentalsModal {...getInfo(info)} isDLV={isDLV}/>
    }
}