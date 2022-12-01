import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StateAndSet } from './SharedTypes';

export enum ModalAction{
    NONE = 0,
    OPEN = 1
}

type ModalState = {
    open: boolean;
}

const animation_blur_keyframes: Keyframe[] = [{'filter' : 'blur(0px)'}, {'filter' : 'blur(20px)'}];

const animation_blur_options: KeyframeAnimationOptions = {duration: 200, fill: 'forwards'};

type ModalProps = StateAndSet<ModalState> & {
    children?: React.ReactNode,
    title: React.ReactNode
}

export default function Modal(props: ModalProps){
    const modalDiv = React.useRef<HTMLElement>(undefined);
    const blurAnimation = React.useRef<Animation>(undefined);
    const [state, setState] = (props.setState != undefined) ? [props.state, props.setState] : React.useState(props.state);
    if(modalDiv.current == undefined){
        modalDiv.current = document.createElement("div");
        modalDiv.current.className = "modal-wrapper";
        document.body.append(modalDiv.current);
    }
    if(blurAnimation.current == undefined){
        blurAnimation.current = document.getElementById("root").animate(animation_blur_keyframes, animation_blur_options);
        blurAnimation.current.cancel();
    }
    React.useEffect(() => {
        if(state.open){
            blurAnimation.current.play();
            modalDiv.current.style.display = "";
        }else{
            blurAnimation.current.cancel();
            modalDiv.current.style.display = "none";
        }
    }, [state.open]);
    React.useEffect(() => {
        const keyboardListener = (e: KeyboardEvent) => {
            if(e.key == "Escape"){
                setState({open: false});
            }
        }
        document.body.addEventListener("keydown", keyboardListener);
        return () => {
            blurAnimation.current.cancel();
            document.body.removeEventListener("keydown", keyboardListener);
            document.body.removeChild(modalDiv.current);
        }
    }, []);
    if(state.open){
        return ReactDOM.createPortal((<div className="modal-content">herp{props.children}</div>), modalDiv.current);
    }else{
        return <></>;
    }
}