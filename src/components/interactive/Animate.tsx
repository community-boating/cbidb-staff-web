import * as React from 'react';
import { setStatePartial } from '../dockhouse/SharedTypes';

type OptionsType = (number | KeyframeAnimationOptions) & ({
   forwardRate?: number,
   reverseRate?: number,
   updateFramesOnWindowResize?: boolean,
   updateFramesOnStateChange?: boolean
});

type FramesType<T_Size_State> = Keyframe[] | ((sizeState: T_Size_State) => Keyframe[]);

type DivRef = React.RefObject<HTMLDivElement>;

export type AnimationType<T_State, T_State_Var extends keyof T_State, T_Size_State> = {
   frames: FramesType<T_Size_State>;
   options: OptionsType;
   shouldStartAnimation: (state: T_State) => AnimationStartType;
   getStateVar?: (state: T_State) => T_State[T_State_Var];
   stateEnd?: (state: T_State) => Partial<T_State>;
   stateStart?: (state: T_State) => Partial<T_State>;
};

export enum AnimationStartType {
   NONE,
   FORWARD,
   REVERSE
}

export type AnimateProps<T_State, T_State_Var extends keyof T_State, T_Size_State> = {
   ref: DivRef;
   state: T_State;
   sizeState?: T_Size_State;
   setState: React.Dispatch<React.SetStateAction<T_State>>;
   //isVisible?: (state: T_State) => boolean;
   animations: AnimationType<T_State, T_State_Var, T_Size_State>[];
   //className?: string;
   //children?: React.ReactNode;
}

export type StyleControllerProps<T_Style_State> = {
   ref: DivRef;
   styleState: T_Style_State;
   controller: StyleController<T_Style_State>;
}

export type SizeListenerProps<T_Size_State> = {
   ref: DivRef;
   deriveSizeState: (ref: DivRef) => T_Size_State;
   compareSizeState?: (a: T_Size_State, b: T_Size_State) => boolean;
   sizeState: T_Size_State;
   setSizeState: React.Dispatch<React.SetStateAction<T_Size_State>>;
}

export interface StyleController<T_Style_State> {
   applyStyling(ref: DivRef, state: T_Style_State);
}

export function sizeListener<T_Size_State, T_Style_State = any>(props: SizeListenerProps<T_Size_State>, propsStyle?: StyleControllerProps<T_Style_State>){
      React.useEffect(() => {
         //const refO = {current: currentO};
         const listener = () => {
            if(propsStyle != undefined)
               propsStyle.controller.applyStyling(propsStyle.ref, null);
            const newState = props.deriveSizeState(props.ref);
            if(propsStyle != undefined)
               propsStyle.controller.applyStyling(propsStyle.ref, propsStyle.styleState);
            if(props.compareSizeState == undefined || props.compareSizeState(props.sizeState, newState)){
               props.setSizeState(newState);
            }
            //const newState = 
         }
         console.log("doing it");
         window.addEventListener("resize", listener);
         return () => {
            console.log("cleanup");
            window.removeEventListener("resize", listener);
         }
      }, []);
}

export function styleController<T_Style_State>(props: StyleControllerProps<T_Style_State>){
   React.useEffect(() => {
      props.controller.applyStyling(props.ref, props.styleState);
   }, [props.styleState]);
}

function orElse(a: number, o: number){
   return a == undefined ? o : a;
}

export function animate<T_State, T_State_Var extends keyof T_State, T_Size_State>(props: AnimateProps<T_State, T_State_Var, T_Size_State>){
   const ref = props.ref;
   const wrapRef = React.createRef<HTMLDivElement>();
   props.animations.forEach((a) => {
      const animationRef = React.useRef<Animation>(undefined);
      const frames = a.frames;
      if(typeof frames == "function"){
         React.useEffect(() => {
            if(animationRef.current == undefined)
               return;
            (animationRef.current.effect as KeyframeEffect).setKeyframes(frames(props.sizeState));
         }, [props.sizeState, animationRef.current]);
      }

      React.useEffect(() => {
         animationRef.current = ref.current.animate(typeof a.frames == "function" ? [] : a.frames, a.options);
         animationRef.current.cancel();
         animationRef.current.addEventListener("finish", () => {
            if(a.stateEnd != undefined){
               props.setState((s) => setStatePartial(s, a.stateEnd(s)));
            }
         });
      }, []);

      React.useEffect(() => {
         if(animationRef.current == undefined){
            return;
         }
         const shouldStart = a.shouldStartAnimation(props.state);
         if(shouldStart == AnimationStartType.NONE){
            animationRef.current.cancel();
            return;
         }
         animationRef.current.updatePlaybackRate(shouldStart == AnimationStartType.FORWARD ? orElse(a.options.forwardRate, 1) : orElse(a.options.reverseRate, -1));
         animationRef.current.play();
         if(a.stateStart != undefined){
            props.setState((s) => setStatePartial(s, a.stateStart(s)));
         }
      }, [a.getStateVar(props.state)]);
      
   });
}