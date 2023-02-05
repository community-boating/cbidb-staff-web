import { SelectedType, selectKeyRosterPerson, selectKeySignout, selectKeySignoutPerson } from "./ClassSelectableDiv";
import { SignoutCombinedType } from '../SignoutCombinedType';
import { ClassType } from 'async/staff/dockhouse/get-classes';


export function getSelectedSignoutPeople(associatedSignouts: SignoutCombinedType[], selected: SelectedType) {
    return associatedSignouts.flatMap((a) => a.currentPeople.filter((b) => selected[selectKeySignoutPerson(a.signoutId, b.personId)]));
}

export function getSelectedRosterPeople(currentClass: ClassType, selected: SelectedType) {
    return currentClass.$$apClassSignups.filter((a) => selected[selectKeyRosterPerson(a.$$person.personId)]);
}

export function getSelectedSignouts(associatedSignouts: SignoutCombinedType[], selected: SelectedType) {
    return associatedSignouts.filter((a) => selected[selectKeySignout(a.signoutId)]);
}