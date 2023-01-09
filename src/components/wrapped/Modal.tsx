import * as React from 'react';
import { Dialog } from '@headlessui/react'
import Theme from 'layouts/Theme';
import { SignoutStateAdapter } from 'pages/dockhouse/signouts/SignoutsTable';
import { findChildren } from 'components/Injector';

export enum ModalAction{
    NONE = 0,
    OPEN = 1
}

type ModalProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children?: React.ReactNode;
    className?: string;
}

type ModalWrapperProps = {
    children?: React.ReactNode
}

export function ModalHeader(props: ModalWrapperProps){
    return <ModalWrapper {...props}/>;
}

export function ModalDescription(props: ModalWrapperProps){
    return <ModalWrapper {...props}/>;
}

export function ModalFoooter(props: ModalWrapperProps){
    return <ModalWrapper {...props}/>;
}

function ModalWrapper(props: ModalWrapperProps){
    return <></>
}

function modalWrapRecurse(store: {headers: React.ReactNode[], descriptions: React.ReactNode[], footers: React.ReactNode[]}, children: React.ReactNode, depth: number){
    if(depth > 5){
        return;
    }
    React.Children.forEach(React.Children.toArray(children), (a, i) => {
        if(React.isValidElement(a)){
            switch(a.type){
                case ModalHeader:
                    store.headers.push(a.props.children);
                    break;
                case ModalDescription:
                    store.descriptions.push(a.props.children);
                    break;
                case ModalFoooter:
                    store.footers.push(a.props.children);
                    break;
                default:
                    modalWrapRecurse(store, a.props.children, depth+1);
            }
        }
    });
    
}

export default function Modal(props: ModalProps){
    const store = {
        headers: [] as React.ReactNode[],
        descriptions: [] as React.ReactNode[],
        footers: [] as React.ReactNode[]
    }
    modalWrapRecurse(store, props.children, 0);
    console.log("running modal");
    return (
        <Dialog className="fixed h-full w-full top-0 left-0 flex items-center justify-center z-10" open={props.open} onClose={() => props.setOpen(false)}>
                <Dialog.Panel className={props.className}>
                    <Theme>
                        <div className="flex flex-col p-5 h-full">
                            <Dialog.Title><div className="flex flex-row">{store.headers}<button className="ml-auto mr-0" onClick={() => props.setOpen(false)}>X</button></div></Dialog.Title>
                            <Dialog.Description>{store.descriptions}</Dialog.Description>
                            {props.children}
                            {store.footers}
                        </div>
                    </Theme>
                </Dialog.Panel>
        </Dialog>);
}