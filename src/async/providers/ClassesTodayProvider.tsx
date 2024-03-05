import { ProviderState } from 'core/AsyncStateProvider';
import * as React from 'react';
import { ApClassSessionWithInstance } from 'models/typerefs';
import GeneticAsyncProvider, { ProviderWithSetState } from './ProviderType';
import { getApClassSessionsToday } from 'models/apiwrappers';

const defaultClassesToday: ProviderWithSetState<ApClassSessionWithInstance[]> = {
    state: [],
    setState: () => {},
    providerState: ProviderState.INITIAL
};

export const ClassesTodayContext = React.createContext(defaultClassesToday);

export default function ClassesTodayProvider(props: {children?: React.ReactNode}){
    return <GeneticAsyncProvider apiWrapper={getApClassSessionsToday} contextProvider={ClassesTodayContext.Provider} initState={defaultClassesToday}>{props.children}</GeneticAsyncProvider>
}