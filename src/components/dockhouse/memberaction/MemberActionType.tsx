import * as React from 'react';
import { EditSignoutType } from '../../../pages/dockhouse/signouts/StateTypes';
import { SignoutTablesState } from 'async/staff/dockhouse/signouts';
import { MemberActionModal, EditSignoutModal } from './ActionModal';
import { Action } from './ActionModalProps';

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
