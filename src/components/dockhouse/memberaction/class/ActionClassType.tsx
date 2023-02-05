import * as React from 'react';
import { ClassType } from 'async/staff/dockhouse/get-classes';
import ActionClassModal from './ActionClassModal';
import { SignoutCombinedType } from '../SignoutCombinedType';
import { Action } from '../ActionModalProps';
import { AttendanceEntry, AttendanceType } from 'async/staff/dockhouse/attendance';

export type AttendanceMap = {
    [key: number]: AttendanceEntry
}

export type ActionClassType = {
    currentClass: ClassType
    currentSession: ClassType['$$apClassSessions'][number]
    associatedSignouts: SignoutCombinedType[]
    attendanceMap: AttendanceMap
};

export class ActionClass extends Action<ActionClassType> {
    constructor(currentClass: ClassType, currentSession: ClassType['$$apClassSessions'][number], associatedSignouts: SignoutCombinedType[], attendanceMap: AttendanceMap) {
        super();
        this.modeInfo = {
            currentClass: currentClass,
            currentSession: currentSession,
            associatedSignouts: associatedSignouts,
            attendanceMap: attendanceMap
        };
    }
    createModalContent(info) {
        return <ActionClassModal {...info} />;
    }
}
