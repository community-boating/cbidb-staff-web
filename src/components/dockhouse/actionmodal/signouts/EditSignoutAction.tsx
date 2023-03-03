import { RatingsContext } from 'async/providers/RatingsProvider';
import { SignoutsTodayContext } from 'async/providers/SignoutsTodayProvider';
import * as React from 'react';
import { Action, getInfo } from '../ActionModalProps';
import { EditSignoutModal } from './EditSignoutModal';
import { SignoutCombinedType } from './SignoutCombinedType';
import { EditSignoutActionModalState, adaptSignoutState } from './EditSignoutType';


export class EditSignoutAction extends Action<SignoutCombinedType, EditSignoutActionModalState> {
    constructor(signoutId: number) {
        super();
        this.initState = {
            actions: []
        };
        this.modeInfo = () => {
            const signoutsToday = React.useContext(SignoutsTodayContext);
            const ratings = React.useContext(RatingsContext);
            return adaptSignoutState(signoutsToday.state.find((a) => a.signoutId == signoutId), ratings);
        };
    }
    createModalContent(info: SignoutCombinedType, state, setState) {
        return <EditSignoutModal info={getInfo(info)} state={state} setState={setState}></EditSignoutModal>;
    }
}
