import * as React from 'react';
import { SignoutsTablesState } from 'async/staff/dockhouse/signouts';


export type ActionModalProps = {
    action: Action<any>
    setAction: (action: Action<any>) => void
};

export abstract class Action<T> {
    modeInfo: T
    createModalContent(info: T): React.ReactNode { return undefined; }
}

export class NoneAction extends Action<undefined> {
}
