import { ModalContext } from 'components/wrapped/Modal';
import * as React from 'react';
import { option } from 'fp-ts';
import Button from 'components/wrapped/Button';
import { AppStateContext } from 'app/state/AppStateContext';
import { postWrapper as createSignout } from 'async/staff/dockhouse/create-signout';
import { SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { buttonClassActive, buttonClasses, buttonClassInactive } from '../styles';
import { adaptMemberState, convertToCreateSignout } from '../signouts/EditSignoutModal';
import { SignoutsTodayContext } from 'async/providers/SignoutsTodayProvider';
import { SignoutType } from 'async/staff/dockhouse/signouts';
import * as moment from 'moment';
import { ActionActionType } from 'components/ActionBasedEditor';

export function CreateQueueSignout(props: { current: SignoutCombinedType; actions: ActionActionType<SignoutCombinedType>}) {
    const asc = React.useContext(AppStateContext);
    const modal = React.useContext(ModalContext);
    const signouts = React.useContext(SignoutsTodayContext);
    const ref = React.createRef<HTMLButtonElement>();
    const submit = (e) => {
        return createSignout.sendJson(asc, convertToCreateSignout(props.current)).then((a) => {
            if (a.type == "Success") {
                modal.setOpen(false);
                signouts.setState((s) => s.concat(adaptMemberState(props.current, {
                    signoutId: -1,
                    programId: -1,
                    classSessionId: option.none,
                    $$skipper: {
                        $$personRatings: [],
                        personId: -1,
                        nameFirst: "",
                        nameLast: ""
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
                    signoutType: SignoutType.TEST,
                    didCapsize: option.some(false),
                    comments: option.none,
                    createdBy: option.none,
                    updatedBy: option.none,
                    updatedOn: option.none,
                    createdOn: option.none,
                    $$crew: []
                })));
            } else {
                //props.setState((s) => ({ ...s, dialogOutput: option.some(a.message) }));
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
