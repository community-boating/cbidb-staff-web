import AsyncStateProvider, { ProviderState } from 'core/AsyncStateProvider';
import * as React from 'react';
import { SignoutsTablesState, getSignoutsToday } from 'async/staff/dockhouse/signouts';
import GeneticAsyncProvider, { ProviderWithSetState } from './ProviderType';
import { SignoutCombinedType } from 'components/dockhouse/actionmodal/signouts/SignoutCombinedType';

const defaultSignoutsToday: ProviderWithSetState<SignoutsTablesState> = {state: [], setState: () => {}, providerState: ProviderState.INITIAL};

export const SignoutsTodayContext = React.createContext(defaultSignoutsToday);

export default function SignoutsTodayProvider(props: {children?: React.ReactNode}){
    return <GeneticAsyncProvider apiWrapper={getSignoutsToday} refreshRate={30*1000} contextProvider={SignoutsTodayContext.Provider} initState={defaultSignoutsToday.state}>{props.children}</GeneticAsyncProvider>
}

/*export default function SignoutsTodayProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getSignoutsToday} refreshRate={30*1000} initState={[]} makeChildren={(state, setState, providerState) => {return <SignoutsTodayContext.Provider value={{state:state, setState:setState, providerState:providerState}}>{props.children}</SignoutsTodayContext.Provider>}}/>
}*/