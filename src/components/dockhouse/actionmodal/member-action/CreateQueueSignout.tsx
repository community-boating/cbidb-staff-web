import { ModalContext } from 'components/wrapped/Modal';
import * as React from 'react';
import { option } from 'fp-ts';
import Button from 'components/wrapped/Button';
import { AppStateContext } from 'app/state/AppStateContext';
import { SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { buttonClassActive, buttonClasses, buttonClassInactive } from '../styles';
import { adaptMemberState, convertToCreateSignout } from '../signouts/EditSignoutModal';
import { SignoutsTodayContext } from 'async/providers/SignoutsTodayProvider';
import { SignoutType } from 'async/staff/dockhouse/signouts';
import * as moment from 'moment';
import { ActionActionType } from 'components/ActionBasedEditor';
import { none } from 'fp-ts/lib/Option';
import { postCreateSignout } from 'models/apiwrappers';

export function CreateQueueSignout(props: { current: SignoutCombinedType; actions: ActionActionType<SignoutCombinedType>, setDialogOutput: React.Dispatch<React.SetStateAction<option.Option<string>>>}) {
    const asc = React.useContext(AppStateContext);
    const modal = React.useContext(ModalContext);
    const signouts = React.useContext(SignoutsTodayContext);
    const ref = React.createRef<HTMLButtonElement>();
    const submit = (e) => {
        console.log("hello");
        const v = convertToCreateSignout(props.current)
        console.log(v);
        console.log(props.current);
        return postCreateSignout.sendJson(asc, v).then((a) => {
            if (a.type == "Success") {
                modal.setOpen(false);
                signouts.setState((s) => s.concat(adaptMemberState(props.current, {
                    signoutId: -1,
                    programId: -1,
                    classSessionId: option.none,
                    $$skipper: {
                        $$personRatings: [],
                        personId: -1,
                        nameFirst: none,
                        nameLast: none
                    },
                    apAttendanceId: option.none,
                    jpAttendanceId: option.none,
                    boatId: -1,
                    personId: option.none,
                    cardNum: option.none,
                    sailNumber: option.none,
                    hullNumber: option.none,
                    signoutDatetime: option.some(moment()),
                    signinDatetime: option.none,
                    testRatingId: option.none,
                    testResult: option.none,
                    signoutType: SignoutType.SAIL,
                    didCapsize: option.some(false),
                    comments: option.none,
                    createdBy: option.none,
                    updatedBy: option.none,
                    updatedOn: option.none,
                    createdOn: option.none,
                    $$crew: [],
                    $$tests: []
                })));
            } else {
                props.setDialogOutput(option.some(a.message));
            }
        });
    }
    return <>
        <div className="flex flex-row gap-2 mr-0 ml-auto">
            <Button tabIndex={5} id="focusLoopback" className={buttonClasses + " " + buttonClassInactive} spinnerOnClick submit={submit}>Queue Signout</Button>
            <Button tabIndex={6} className={buttonClasses + " " + buttonClassActive} spinnerOnClick submit={submit}>Create Signout</Button>
            <div tabIndex={7} onFocus={(e) => {
                const element = document.getElementById("focusLoopback");
                if(element){
                    element.focus();
                }
            }}></div>
        </div>
    </>;
}
