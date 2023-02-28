import AsyncStateProvider, { ProviderState } from 'core/AsyncStateProvider';
import * as React from 'react';
import { SignoutsTablesState, getSignoutsToday } from 'async/staff/dockhouse/signouts';

const defaultSignoutsToday: {
    signouts: SignoutsTablesState,
    setSignouts: React.Dispatch<React.SetStateAction<SignoutsTablesState>>,
    providerState: ProviderState
} = {signouts: [], setSignouts: () => {}, providerState: ProviderState.INITIAL};

export const SignoutsTodayContext = React.createContext(defaultSignoutsToday);

export default function SignoutsTodayProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getSignoutsToday} refreshRate={30*1000} initState={[]} makeChildren={(state, setState, providerState) => {return <SignoutsTodayContext.Provider value={{signouts:state, setSignouts:setState, providerState:providerState}}>{props.children}</SignoutsTodayContext.Provider>}}/>
}