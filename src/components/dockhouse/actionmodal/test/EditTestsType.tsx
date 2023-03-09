import { SignoutsTablesState } from "async/staff/dockhouse/signouts"
import { TestType } from "async/staff/dockhouse/tests"
import { ReactNode } from "react"
import { Action, getInfo } from "../ActionModalProps"
import EditTestsModal from "./EditTestsModal"
import * as React from 'react';
import { SignoutsTodayContext } from "async/providers/SignoutsTodayProvider"

export type EditTestsType = {
    testingSignouts: SignoutsTablesState
}

export class EditTestsAction extends Action<EditTestsType, {}>{
    constructor(){
        super();
        this.initState = {}
        this.modeInfo = () => {
            const signouts = React.useContext(SignoutsTodayContext);
            const testingSignouts = signouts.state.filter((a) => a.$$tests.length > 0);
            console.log("calling", signouts);

            return {
                testingSignouts
            }
        }
    }
    createModalContent(info: EditTestsType): ReactNode {
        return <EditTestsModal {...getInfo(info)}/>
    }
}