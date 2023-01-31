import * as React from 'react';
import { EditSignoutType } from '../../../pages/dockhouse/signouts/StateTypes';
import { SignoutTablesState } from 'async/staff/dockhouse/signouts';
import { MemberActionModal, EditSignoutModal } from './ActionModal';
import { ClassType } from 'async/staff/dockhouse/get-classes';
import { Option } from 'fp-ts/lib/Option';
import { Moment } from 'moment';
import ActionClassModal from './class/ActionClassModal';


export type ActionModalProps = {
    action: Action<any>;
    setAction: (action: Action<any>) => void;
};

export abstract class Action<T> {
    modeInfo: T;
    createModalContent(info: T): React.ReactNode { return undefined; }
}
export type MemberActionType = {
    scannedCard: string;
};

export class MemberAction extends Action<MemberActionType> {
    constructor(scannedCard: string) {
        super();
        this.modeInfo = { scannedCard };
    }
    createModalContent(info: MemberActionType) {
        return <MemberActionModal {...info}></MemberActionModal>;
    }
}

export class EditSignoutAction extends Action<EditSignoutType> {
    constructor(row: SignoutTablesState, onSubmit: (row: SignoutTablesState) => Promise<any>) {
        super();
        this.modeInfo = {
            currentSignout: row,
            onSubmit: onSubmit
        };
    }
    createModalContent(info: EditSignoutType) {
        return <EditSignoutModal {...info}></EditSignoutModal>;
    }
}

export type ActionClassType = {
    currentClass: ClassType
    currentSession: ClassType['$$apClassSessions'][number]
}

export class ActionClass extends Action<ActionClassType> {
    constructor(currentClass: ClassType, currentSession: ClassType['$$apClassSessions'][number]){
        super();
        this.modeInfo = {
            currentClass: currentClass,
            currentSession: currentSession
        }
    }
    createModalContent(info) {
        return <ActionClassModal {...info}/>;
    }
}

export class NoneAction extends Action<undefined> {
}
