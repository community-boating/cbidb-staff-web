import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StateAndSet } from '../dockhouse/SharedTypes';
import { Dialog } from '@headlessui/react'

export enum ModalAction{
    NONE = 0,
    OPEN = 1
}


type ModalState = boolean;

const animation_blur_keyframes: Keyframe[] = [{'filter' : 'blur(0px)'}, {'filter' : 'blur(20px)'}];

const animation_blur_options: KeyframeAnimationOptions = {duration: 200, fill: 'forwards'};

type ModalProps = StateAndSet<ModalState> & {
    children?: React.ReactNode,
    title: React.ReactNode
    description?: string;
}

export default function Modal(props: ModalProps){
    return (
    <Dialog className="modal-wrapper" open={props.state} onClose={() => props.setState(false)}>
            <Dialog.Panel className="modal-content">
                <Dialog.Title>{props.title}</Dialog.Title>
                <Dialog.Description>{props.description}</Dialog.Description>
                <button onClick={() => props.setState(false)}>Click</button>
                {props.children}
            </Dialog.Panel>
    </Dialog>);
}