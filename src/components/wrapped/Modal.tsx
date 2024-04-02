import * as React from 'react';
import { Dialog } from '@headlessui/react'
import Theme from 'layouts/Theme';
import { X } from 'react-feather';
import CloseIcon from './Icons';

export enum ModalAction {
    NONE = 0,
    OPEN = 1
}

type ModalProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children?: React.ReactNode;
    className?: string;
}

export type ModalContextType = {
    open: boolean,
    setOpen: (open: boolean) => void,
}

export const ModalContext = React.createContext<ModalContextType>({open: false, setOpen: undefined})

export function ModalHeader(props: {className?: string, children?: React.ReactNode, custom?: boolean}){
    if(!props.custom){
        const context = React.useContext(ModalContext);
        return <Dialog.Title className={"flex flex-row border-b mb-2 border-black w-full " + props.className}>
                    {props.children}
                    <CloseIcon className="ml-auto mr-0" onClick={(e) => {e.preventDefault();context.setOpen(false);}}>
                    </CloseIcon>
                </Dialog.Title>
    }
    return <Dialog.Title className={props.className}>{props.children}</Dialog.Title>;
}

export function ModalDescription(props: {children?: React.ReactNode}){
    return <Dialog.Description>{props.children}</Dialog.Description>;
}

export function DefaultModalBody(props: {children?: React.ReactNode}){
    return <div className="h-[calc(100vh-10vw)] w-[90vw] flex flex-col overflow-scroll">
        {props.children}
    </div>
}

export default function Modal(props: ModalProps){
    return (
        <Dialog className="fixed h-full w-full top-0 left-0 flex items-center justify-center z-10" open={props.open} onClose={() => props.setOpen(false)}>
                <Dialog.Panel className={props.className + " bg-background flex flex-col p-5 top-[200px auto]"}>
                    <Theme>
                        <ModalContext.Provider value={props}>
                                {props.children}
                        </ModalContext.Provider>
                    </Theme>
                </Dialog.Panel>
        </Dialog>);
}