import { SignoutsTablesState } from "async/staff/dockhouse/signouts"
import { TestType } from "async/staff/dockhouse/tests"
import { ReactNode } from "react"
import { Action } from "../ActionModalProps"
import EditTestsModal from "./EditTestsModal"
import * as React from 'react';

export type EditTestsType = {
    testingSignouts: SignoutsTablesState
    tests: TestType[]
}

export class EditTestsAction extends Action<EditTestsType, {}>{
    constructor(testingSignouts: SignoutsTablesState, tests: TestType[]){
        super();
        this.modeInfo = {
            testingSignouts,
            tests
        }
    }
    createModalContent(info: EditTestsType): ReactNode {
        return <EditTestsModal {...info}/>
    }
}