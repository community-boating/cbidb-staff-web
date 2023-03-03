import * as React from 'react';
import { MemberActionModal } from "./MemberActionModal";
import { Action } from '../ActionModalProps';
import { ScannedPersonType } from 'async/staff/dockhouse/scan-card';
import { SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { option } from 'fp-ts';
import { EditAction } from 'components/ActionBasedEditor';

export type MemberActionType = SignoutCombinedType & {
    currentClassSessionId: option.Option<number>
}

export type MemberActionModalStateType = {
    actions: EditAction<MemberActionType>[]
}

export const defaultSignout: (scannedPerson: ScannedPersonType) => MemberActionType = (scannedPerson) => ({
    currentPeople: [{ ...scannedPerson, isSkipper: true, isTesting: true, testRatingId: option.none}],
    boatId: option.none,
    boatNum: option.none,
    hullNum: option.none,
    sailNum: option.none,
    signoutType: option.none,
    testRating: option.none,
    signoutId: -1,
    currentClassSessionId: option.none
})

export class MemberAction extends Action<MemberActionType, MemberActionModalStateType> {
    constructor(initial: MemberActionType) {
        super();
        this.modeInfo = initial;
        this.initState = {
            actions: []
        }
    }
    createModalContent(info: MemberActionType, state, setState) {
        return <MemberActionModal info={info} state={state} setState={setState}></MemberActionModal>;
    }
}