import * as React from 'react';
import { AnimationStartType, AnimationType, animate, styleController, sizeListener } from '../interactive/Animate';
import { setStatePartial, StateAndSet } from './SharedTypes';

type PopoverAnimationType = AnimationType<PopoverState, 'action', {height: string}>;

const animation_shrink: PopoverAnimationType = {
    frames: (ref) => [{maxHeight : '0px'}, {maxHeight : ref.height}],
    options: {duration: 2000, fill: 'forwards', forwardRate: 1},
    shouldStartAnimation(state) {
        if(state.action == PopoverActionState.ACTION_OPEN){
            return AnimationStartType.FORWARD;
        }
        if(state.action == PopoverActionState.ACTION_CLOSE){
            return AnimationStartType.REVERSE;
        }
        return AnimationStartType.NONE;
    },
    stateStart() {
        return {open: true};
    },
    stateEnd(state){
        return {open: state.action == PopoverActionState.ACTION_OPEN, action: PopoverActionState.ACTION_NONE};
    },
    getStateVar(state){
        return state.action;
    }
};

export enum PopoverActionState {
    ACTION_NONE = 0,
    ACTION_OPEN = 1,
    ACTION_CLOSE = 2
}

export enum PopoverLocation {
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4
}

export type PopoverProps = StateAndSet<PopoverState> & {
    children?: React.ReactNode
}

type PopoverState = {
    open: boolean,
    action: PopoverActionState,
    location: PopoverLocation
}

type PopoverWithLabelProps = {
    location: PopoverLocation,
    label?: React.ReactNode,
    children?: React.ReactNode
}

function clientHeightPadded(ref: React.RefObject<HTMLDivElement>){
    return (ref.current || {clientHeight: 200}).clientHeight + "px";
}

export default function Popover(props: PopoverProps){
    const [state, setState] = (props.setState != undefined) ? [props.state, props.setState] : React.useState(props.state);
    const className = state.location == PopoverLocation.DOWN ? "popover" : "popover right";
    const [sizeState, setSizeState] = React.useState({height: "0px"});
    const ref = React.createRef<HTMLDivElement>();
    const controller = {
        applyStyling: (r, s) => {
            if(s == undefined){
                r.current.style.display = "";
                return;
            }
            r.current.style.display = s ? "" : "none";
            //console.log(r);
            //console.log(s);
        }
    }
    const styleProps = {ref, styleState:state.open, controller}
    styleController(styleProps);
    sizeListener({ref, deriveSizeState(r) {
        return {height: r.current.clientHeight + "px"}
    },sizeState, setSizeState}, styleProps);
    animate({state, setState, sizeState, ref:ref, animations:[animation_shrink]});
    return <div ref={ref} className={className}><div className="popover-wrapper">{props.children}</div></div>;
}

export function openPopover(state: PopoverState) {
    return setStatePartial(state, {open: false, action: PopoverActionState.ACTION_OPEN});
}

export function closePopover(state: PopoverState) {
    return setStatePartial(state, {open: true, action: PopoverActionState.ACTION_CLOSE});
}

export function PopoverWithLabel(props: PopoverWithLabelProps){
    const [state, setState] = React.useState({open: false, action: PopoverActionState.ACTION_NONE, location: props.location});
    return (<div className="selectInput" onPointerEnter={() => {setState(openPopover)}} onPointerLeave={() => {setState(closePopover)}}>
        {props.label}
        <Popover state={state} setState={setState}>
            {props.children}
        </Popover>
    </div>);
}