import { ModalContext } from 'components/wrapped/Modal';
import * as React from 'react';
import Button from 'components/wrapped/Button';
import { AppStateContext } from 'app/state/AppStateContext';
import { SignoutCombinedType } from './SignoutCombinedType';
import { putSignout } from 'async/staff/dockhouse/signouts';
import { buttonClassActive, buttonClasses, buttonClassInactive } from '../styles';
import { SignoutsTodayContext } from 'async/providers/SignoutsTodayProvider';
import { ActionActionType } from 'components/ActionBasedEditor';
import { adaptMemberState } from './EditSignoutModal';

export function SubmitEditSignout(props: { current: SignoutCombinedType; actions: ActionActionType<SignoutCombinedType>; }) {
    const asc = React.useContext(AppStateContext);
    const signouts = React.useContext(SignoutsTodayContext);
    return <div className="flex flex-row gap-2 ml-auto mr-0 mt-auto mb-0">
        <ModalContext.Consumer>
            {(value) => {
                return <>
                    <Button className={buttonClasses + " " + buttonClassInactive} onClick={(e) => {
                        value.setOpen(false);
                    }}>Cancel</Button>
                    <Button className={buttonClasses + " " + buttonClassActive} spinnerOnClick onClick={(e) => {
                        const adaptedToSignout = adaptMemberState(props.current, signouts.state.find((a) => a.signoutId == props.current.signoutId));
                        return putSignout.sendJson(asc, adaptedToSignout).then((a) => {
                            if (a.type == "Success") {
                                signouts.setState((s) => s.map((b) => {
                                    if (b.signoutId == adaptedToSignout.signoutId)
                                        return adaptedToSignout;
                                    return b;
                                }));
                                value.setOpen(false);
                            }
                        });
                    }}>Save</Button>
                </>;
            }}
        </ModalContext.Consumer>
    </div>;
}
