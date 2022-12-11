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
    <Dialog className="fixed h-full w-full top-0 left-0 flex items-center justify-center z-10" open={props.state} onClose={() => props.setState(false)}>
            <Dialog.Panel className="bg-white w-[75%] h-[75%]">
                <Dialog.Title>{props.title}</Dialog.Title>
                <Dialog.Description>{props.description}</Dialog.Description>
                <button className="justify-right" onClick={() => props.setState(false)}>Close</button>
                {props.children}
            </Dialog.Panel>
    </Dialog>);
}