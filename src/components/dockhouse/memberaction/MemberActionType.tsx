import * as React from 'react';
import { EditSignoutType } from '../../../pages/dockhouse/signouts/StateTypes';
import { SignoutTablesState } from 'async/staff/dockhouse/signouts';
import { MemberActionModal, EditSignoutModal } from './ActionModal';
import { Action } from './ActionModalProps';
import { ScannedCrewType } from 'async/staff/dockhouse/scan-card';

export type MemberActionType = {
    scannedPerson: ScannedCrewType[number];
};

export class MemberAction extends Action<MemberActionType> {
    constructor(scannedPerson: ScannedCrewType[number]) {
        super();
        this.modeInfo = {scannedPerson: scannedPerson};
    }
    createModalContent(info: MemberActionType) {
        return <MemberActionModal {...info}></MemberActionModal>;
    }
}

export class EditSignoutAction extends Action<EditSignoutType> {
    constructor(row: SignoutTablesState) {
        super();
        this.modeInfo = {
            currentSignout: row
        };
    }
    createModalContent(info: EditSignoutType) {
        return <EditSignoutModal {...info}></EditSignoutModal>;
    }
}
