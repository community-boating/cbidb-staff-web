import * as React from 'react';
import { Action, getInfo } from '../ActionModalProps';
import ChooseClassModal from './ChooseClassModal';


export type ActionChooseClassType = {};

export class ActionChooseClass extends Action<ActionChooseClass, {}> {
    constructor() {
        super();
    }
    createModalContent(info) {
        return <ChooseClassModal {...getInfo(info)} />;
    }
}
