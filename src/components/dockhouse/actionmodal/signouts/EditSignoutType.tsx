import { SignoutTablesState } from 'async/staff/dockhouse/signouts';
import { EditSignoutType } from 'pages/dockhouse/signouts/StateTypes';
import * as React from 'react';
import { Action } from '../ActionModalProps';
import { EditSignoutModal } from './EditSignoutModal';

export class EditSignoutAction extends Action<EditSignoutType, {}> {
    constructor(row: SignoutTablesState) {
        super();
        this.modeInfo = {
            currentSignout: row
        };
    }
    createModalContent(info: EditSignoutType, state, setState) {
        return <EditSignoutModal info={info} state={state} setState={setState}></EditSignoutModal>;
    }
}
