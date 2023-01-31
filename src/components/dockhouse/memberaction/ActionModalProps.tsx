import * as React from 'react';
import { SignoutsTablesState } from 'async/staff/dockhouse/signouts';
import { ClassType } from 'async/staff/dockhouse/get-classes';
import ActionClassModal from './class/ActionClassModal';


export type ActionModalProps = {
    action: Action<any>;
    setAction: (action: Action<any>) => void;
};

export abstract class Action<T> {
    modeInfo: T;
    createModalContent(info: T): React.ReactNode { return undefined; }
}
export type ActionClassType = {
    currentClass: ClassType
    currentSession: ClassType['$$apClassSessions'][number]
    associatedSignouts: SignoutsTablesState
}

export class ActionClass extends Action<ActionClassType> {
    constructor(currentClass: ClassType, currentSession: ClassType['$$apClassSessions'][number], associatedSignouts: SignoutsTablesState){
        super();
        this.modeInfo = {
            currentClass: currentClass,
            currentSession: currentSession,
            associatedSignouts: associatedSignouts
        }
    }
    createModalContent(info) {
        return <ActionClassModal {...info}/>;
    }
}

export class NoneAction extends Action<undefined> {
}
