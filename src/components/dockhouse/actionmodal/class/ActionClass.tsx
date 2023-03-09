import * as React from 'react';
import ActionClassModal from './ActionClassModal';
import { ActionClassModalState, ActionClassType } from "./ActionClassType";
import { SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { Action, getInfo } from '../ActionModalProps';
import { AttendanceEntry, AttendanceType } from 'async/staff/dockhouse/attendance';
import { SelectedType } from './ClassSelectableDiv';
import { option } from 'fp-ts';
import { EditAction } from 'components/ActionBasedEditor';
import { ApClassSession } from 'async/staff/dockhouse/ap-class-sessions';
import { SignoutsTodayContext } from 'async/providers/SignoutsTodayProvider';
import { ClassesTodayContext } from 'async/providers/ClassesTodayProvider';
import { AllClassesContext } from 'async/providers/AllClassesProvider';
import { SignoutType } from 'async/staff/dockhouse/signouts';
import { RatingsContext } from 'async/providers/RatingsProvider';
import { adaptSignoutState } from '../signouts/EditSignoutType'

export const getClassInfo = (currentClassSessionId: number) =>  () => {
    const signoutsToday = React.useContext(SignoutsTodayContext);
    const classesToday = React.useContext(ClassesTodayContext);
    const allClasses = React.useContext(AllClassesContext);
    const ratings = React.useContext(RatingsContext);
    return React.useMemo(() => {
        const currentClass = classesToday.state.find((a) => a.sessionId == currentClassSessionId) || allClasses.find((a) => a.sessionId == currentClassSessionId);
        const allPersons = []/*currentClass.$$apClassInstance.$$apClassSignups.reduce((a, b) => {
            a[b.personId] = true;
            return a;
        }, {});*/
        const associatedSignouts = signoutsToday.state.filter((a) => a.signoutType == SignoutType.CLASS).map((a) => adaptSignoutState(a, ratings)).filter((a) => a.currentPeople.some((b) => allPersons[b.personId]));
        const attendanceMap = [];
        return {
            currentClass: currentClass,
            associatedSignouts: associatedSignouts,
            attendanceMap: attendanceMap
}}, [signoutsToday.state, classesToday, allClasses, ratings])};

export class ActionClass extends Action<ActionClassType, ActionClassModalState> {
    constructor(currentClassSessionId: number) {
        super();
        this.modeInfo = getClassInfo(currentClassSessionId)
        this.initState = {
            actions: [],
            selected: {},
            selectType: undefined,
            currentRating: option.none,
            grantingInstructorId: option.none
        }
    }
    createModalContent(info, state, setState) {
        return <ActionClassModal info={getInfo(info)} state={state} setState={setState}/>;
    }
    
}
