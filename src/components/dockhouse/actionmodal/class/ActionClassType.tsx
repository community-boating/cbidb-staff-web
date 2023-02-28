import { EditAction } from 'components/ActionBasedEditor';
import { option } from 'fp-ts';
import { SelectedType } from "./ClassSelectableDiv";
import { ApClassSession } from 'async/staff/dockhouse/ap-class-sessions';
import { SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { AttendanceEntry } from 'async/staff/dockhouse/attendance';

export type AttendanceMap = {
    [key: number]: AttendanceEntry;
};

export type ActionClassType = {
    currentClass: ApClassSession;
    associatedSignouts: SignoutCombinedType[];
    attendanceMap: AttendanceMap;
};

export type ActionClassModalState = {
    actions: EditAction<ActionClassType>[];
    selected: SelectedType;
    selectType;
    currentRating: option.Option<number>;
    grantingInstructorId: option.Option<number>;
};
