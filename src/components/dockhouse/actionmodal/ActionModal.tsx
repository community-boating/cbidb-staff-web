import Modal from 'components/wrapped/Modal';
import * as React from 'react';


import { Action, ActionModalProps, NoneAction, setStateChain } from './ActionModalProps';

export default function ActionModal(props: ActionModalProps & {state: any, setState: React.Dispatch<React.SetStateAction<any>>}){
    const modalContent = props.action.createModalContent(props.action.modeInfo, props.state, props.setState, false);
    return (
        <Modal open={props.action && !(props.action instanceof NoneAction)} setOpen={(s) => {if(!s){props.pushAction(new NoneAction())}}} className="bg-gray-100 rounded-lg">
            {modalContent}
        </Modal>);
}

export const ActionModalContext = React.createContext<ActionModalProps>({action: new NoneAction(), pushAction: () => {}});

export function ActionModalProvider(props: {children?: React.ReactNode}){
    const [actionAndState, setActionAndState] = React.useState({modalState: undefined, action: new NoneAction()})
    const setAction = (action: Action<any, any>) => {
        setActionAndState({
            modalState: action.initState,
            action: action
        })
    }
    const setModalState = (state) => {
        setActionAndState((s) => ({
            ...s, modalState: setStateChain(state, s.modalState)
        }))
    }
    return <ActionModalContext.Provider value={{action: actionAndState.action, pushAction: setAction}}>
        {props.children}
        <ActionModal action={actionAndState.action} pushAction={setAction} state={actionAndState.modalState} setState={setModalState}></ActionModal>
    </ActionModalContext.Provider>
}