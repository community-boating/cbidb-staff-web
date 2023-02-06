import * as React from 'react';
import { ClassType } from 'async/staff/dockhouse/get-classes';
import ActionClassModal from './ActionClassModal';
import { SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { Action } from '../ActionModalProps';
import { AttendanceEntry, AttendanceType } from 'async/staff/dockhouse/attendance';
import ChooseClassModal from './ChooseClassModal';
import { SelectedType } from './ClassSelectableDiv';
import { option } from 'fp-ts';
import { EditAction } from 'components/ActionBasedEditor';

export type AttendanceMap = {
    [key: number]: AttendanceEntry
}

export type ActionClassType = {
    currentClass: ClassType
    currentSession: ClassType['$$apClassSessions'][number]
    associatedSignouts: SignoutCombinedType[]
    attendanceMap: AttendanceMap
};

export type ActionChooseClassType = {
};

export class ActionChooseClass extends Action<ActionChooseClass, {}> {
    constructor() {
        super();
    }
    createModalContent(info) {
        return <ChooseClassModal {...info} />;
    }
}

export type ActionClassModalState = {
    actions: EditAction<ActionClassType>[]
    selected: SelectedType
    selectType
    currentRating: option.Option<number>
    grantingInstructorId: option.Option<number>
}

export class ActionClass extends Action<ActionClassType, ActionClassModalState> {
    constructor(currentClass: ClassType, currentSession: ClassType['$$apClassSessions'][number], associatedSignouts: SignoutCombinedType[], attendanceMap: AttendanceMap) {
        super();
        this.modeInfo = {
            currentClass: currentClass,
            currentSession: currentSession,
            associatedSignouts: associatedSignouts,
            attendanceMap: attendanceMap
        };
        this.initState = {
            actions: [],
            selected: {},
            selectType: undefined,
            currentRating: option.none,
            grantingInstructorId: option.none
        }
    }
    createModalContent(info, state, setState) {
        return <ActionClassModal info={info} state={state} setState={setState}/>;
    }
    
}
