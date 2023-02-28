import * as React from 'react';
import { MemberActionModal } from "./MemberActionModal";
import { Action } from '../ActionModalProps';
import { ScannedCrewType, ScannedPersonType } from 'async/staff/dockhouse/scan-card';
import { SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { option } from 'fp-ts';
import { EditAction } from 'components/ActionBasedEditor';

export type MemberActionModalStateType = {
    actions: EditAction<SignoutCombinedType>[]
}

export const defaultSignout: (scannedPerson: ScannedPersonType) => SignoutCombinedType = (scannedPerson) => ({
    currentPeople: [{ ...scannedPerson, isSkipper: true, isTesting: true, testRatingId: option.none}],
    boatId: option.none,
    boatNum: option.none,
    hullNum: option.none,
    sailNum: option.none,
    signoutType: option.none,
    testRating: option.none,
    signoutId: -1
})

export class MemberAction extends Action<SignoutCombinedType, MemberActionModalStateType> {
    constructor(initialSignout: SignoutCombinedType) {
        super();
        this.modeInfo = initialSignout;
        this.initState = {
            actions: []
        }
    }
    createModalContent(info: SignoutCombinedType, state, setState) {
        return <MemberActionModal info={info} state={state} setState={setState}></MemberActionModal>;
    }
}