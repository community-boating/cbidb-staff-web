import { SignoutsTablesState } from "async/staff/dockhouse/signouts"
import { ReactNode } from "react"
import { Action, getInfo, InfoProviderType } from "../ActionModalProps"
import BoatQueueModal from "./BoatQueueModal"
import * as React from 'react';
import { SignoutsTodayContext } from "async/providers/SignoutsTodayProvider";

export type BoatQueueType = {
    boatQueueSignouts: SignoutsTablesState
}

export class BoatQueueAction extends Action<BoatQueueType, {}>{
    constructor(){
        super();
        this.modeInfo = () => {
            const signouts = React.useContext(SignoutsTodayContext);
            return {
                boatQueueSignouts: signouts.state
            }
        }
    }
    createModalContent(info: InfoProviderType<BoatQueueType>, state, setState, isDLV): ReactNode {
        return <BoatQueueModal {...getInfo(info)} isDLV={isDLV} />
    }
}