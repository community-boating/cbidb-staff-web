import * as React from 'react';
import { MemberActionModal } from "./MemberActionModal";
import { Action } from '../ActionModalProps';
import { MemberActionType, MemberActionModalStateType, MemberActionMode } from './MemberActionType';
import { option } from 'fp-ts';


export class MemberAction extends Action<MemberActionType, MemberActionModalStateType> {
    constructor(memberAction: { signout: MemberActionType; mode: MemberActionMode; }) {
        super();
        this.modeInfo = memberAction.signout;
        this.initState = {
            dialogOutput: option.none,
            actions: [],
            mode: memberAction.mode
        };
    }
    createModalContent(info: MemberActionType, state, setState) {
        return <MemberActionModal info={info} state={state} setState={setState}></MemberActionModal>;
    }
}
