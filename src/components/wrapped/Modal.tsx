import * as React from 'react';
import { Dialog } from '@headlessui/react'
import Theme from 'layouts/Theme';

export enum ModalAction{
    NONE = 0,
    OPEN = 1
}

type ModalProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    className?: string;
}

export default function Modal(props: ModalProps){
    return (
        <Dialog className="fixed h-full w-full top-0 left-0 flex items-center justify-center z-10" open={props.open} onClose={() => props.setOpen(false)}>
                <Dialog.Panel className={props.className}>
                    <Theme>
                        <div className="flex flex-col p-5 h-full">
                            <Dialog.Title><div className="flex flex-row">{props.title}<button className="ml-auto mr-0" onClick={() => props.setOpen(false)}>X</button></div></Dialog.Title>
                            <Dialog.Description>{props.description}</Dialog.Description>
                            {props.children}
                        </div>
                    </Theme>
                </Dialog.Panel>
        </Dialog>);
}