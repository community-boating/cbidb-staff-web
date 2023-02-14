import { ModalContext } from 'components/wrapped/Modal';
import * as React from 'react';
import { option } from 'fp-ts';
import Button from 'components/wrapped/Button';
import { AppStateContext } from 'app/state/AppStateContext';
import { postWrapper as createSignout } from 'async/staff/dockhouse/create-signout';
import { SignoutCombinedType } from './SignoutCombinedType';
import { buttonClassActive, buttonClasses, buttonClassInactive } from '../styles';
import { convertToCreateSignout } from './EditSignoutModal';

export function CreateQueueSignout(props: { state: SignoutCombinedType; setState: React.Dispatch<React.SetStateAction<SignoutCombinedType>>; }) {
    const asc = React.useContext(AppStateContext);
    const modal = React.useContext(ModalContext);
    const ref = React.createRef<HTMLButtonElement>();
    return <>
        <div className="flex flex-row gap-2 mr-0 ml-auto">
            <Button tabIndex={5} id="focusLoopback" className={buttonClasses + " " + buttonClassInactive}>Queue Signout</Button>
            <Button tabIndex={6} className={buttonClasses + " " + buttonClassActive} spinnerOnClick submit={(e) => {
                return createSignout.sendJson(asc, convertToCreateSignout(props.state)).then((a) => {
                    if (a.type == "Success") {
                        modal.setOpen(false);
                    } else {
                        props.setState((s) => ({ ...s, dialogOutput: option.some(a.message) }));
                    }
                });
            }}>Create Signout</Button>
            <div tabIndex={7} onFocus={(e) => {
                const element = document.getElementById("focusLoopback");
                if(element){
                    element.focus();
                }
            }}></div>
        </div>
    </>;
}
