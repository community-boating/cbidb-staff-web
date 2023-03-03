import APIWrapper from "core/APIWrapper";
import AsyncStateProvider, { ProviderState } from "core/AsyncStateProvider"
import * as React from 'react';

export type ProviderWithSetState<T_State> = {
    state: T_State,
    setState: React.Dispatch<React.SetStateAction<T_State>>,
    providerState: ProviderState
}

export default function GeneticAsyncProvider<T_API extends APIWrapper<any, any, any>>(props: {children?: React.ReactNode, apiWrapper: T_API, refreshRate?: number, contextProvider: React.Context<ProviderWithSetState<any>>['Provider']}){
    return <AsyncStateProvider apiWrapper={props.apiWrapper} refreshRate={props.refreshRate} initState={[]} makeChildren={(state, setState, providerState) => {return React.createElement(props.contextProvider, {value:{state:state, setState:setState, providerState:providerState}, children: props.children})}}/>
}