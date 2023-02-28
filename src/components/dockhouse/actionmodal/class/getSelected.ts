import { SelectedType, selectKeyRosterPerson, selectKeySignout, selectKeySignoutPerson } from "./ClassSelectableDiv";
import { SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { ApClassSession } from "async/staff/dockhouse/ap-class-sessions";


export function getSelectedSignoutPeople(associatedSignouts: SignoutCombinedType[], selected: SelectedType) {
    return associatedSignouts.flatMap((a) => a.currentPeople.filter((b) => selected[selectKeySignoutPerson(a.signoutId, b.personId)]));
}

export function getSelectedRosterPeople(currentClass: ApClassSession, selected: SelectedType) {
    return currentClass.$$apClassInstance.$$apClassSignups.filter((a) => selected[selectKeyRosterPerson(a.$$person.personId)]);
}

export function getSelectedSignouts(associatedSignouts: SignoutCombinedType[], selected: SelectedType) {
    return associatedSignouts.filter((a) => selected[selectKeySignout(a.signoutId)]);
}