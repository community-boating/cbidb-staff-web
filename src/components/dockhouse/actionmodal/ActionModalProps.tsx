import * as React from 'react';

export type InfoProviderType<T_Info> = T_Info | (() => T_Info)

export type ActionModalPropsWithState<T_Info, T_State> = {
    info: T_Info
    state: T_State
    setState: React.Dispatch<React.SetStateAction<T_State>>
}

export const isCallback = (
    maybeFunction: any | ((...args: any[]) => void),
  ): maybeFunction is (...args: any[]) => void =>
    typeof maybeFunction === 'function'

export function setStateChain<T_State>(state: React.SetStateAction<T_State>, oldState: T_State){
    //console.log("doop");
    //console.log(state);
    //console.log(typeof state);
    if(isCallback(state)){
        return state(oldState);
    }
    return state;
}

export function subStateWithSet<T_State, T_Key extends keyof T_State>(state: T_State, setState: React.Dispatch<React.SetStateAction<T_State>>, key: T_Key): [T_State[T_Key], React.Dispatch<React.SetStateAction<T_State[T_Key]>>]{
    return [state[key], (v) => setState((s) => ({...s, [key]: setStateChain(v, s[key])}))];
}

export function subStateWithSetO<T_State, T_Key extends keyof T_State>(state: T_State, setState: React.Dispatch<React.SetStateAction<T_State>>, key: T_Key): {value: T_State[T_Key], setValue: React.Dispatch<React.SetStateAction<T_State[T_Key]>>}{
    return {value: state[key], setValue: (v) => setState((s) => ({...s, [key]: setStateChain(v, s[key])}))};
}

export type ActionModalProps = {
    action: Action<any, any>
    pushAction: (action: Action<any, any>) => void
};

export abstract class Action<T_Info, T_State> {
    modeInfo: InfoProviderType<T_Info>
    abstract createModalContent(info: T_Info, state: T_State, setState: React.Dispatch<React.SetStateAction<T_State>>, isDLV: boolean): React.ReactNode
    initState?: T_State
}

export class NoneAction extends Action<undefined, undefined> {
    createModalContent(info: undefined, state: undefined, setState: React.Dispatch<(prevState: undefined) => undefined>, isDLV: boolean): React.ReactNode {
        return undefined;
    }
}

export function getInfo<T_Info>(provider: InfoProviderType<T_Info>){
    return typeof provider == 'function' ? provider.apply(undefined, undefined) : provider
}