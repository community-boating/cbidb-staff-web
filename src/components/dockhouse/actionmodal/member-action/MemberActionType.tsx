import * as React from 'react';
import { MemberActionModal } from "./MemberActionModal";
import { Action } from '../ActionModalProps';
import { ScannedCrewType } from 'async/staff/dockhouse/scan-card';
import { SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { option } from 'fp-ts';

export type MemberActionType = {
    scannedPerson: ScannedCrewType[number];
};

export class MemberAction extends Action<MemberActionType, SignoutCombinedType> {
    constructor(scannedPerson: ScannedCrewType[number]) {
        super();
        this.modeInfo = {scannedPerson: scannedPerson};
        this.initState = {
            currentPeople: [{ ...scannedPerson, isSkipper: true, isTesting: true, testRatingId: option.none}],
            boatId: option.none,
            boatNum: option.none,
            hullNum: option.none,
            sailNum: option.none,
            signoutType: option.none,
            testRating: option.none,
            signoutId: -1
        }
    }
    createModalContent(info: MemberActionType, state, setState) {
        return <MemberActionModal info={info} state={state} setState={setState}></MemberActionModal>;
    }
}