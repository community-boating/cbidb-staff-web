import { ProviderState } from 'core/AsyncStateProvider';
import * as React from 'react';
import { ApClassSession, getWrapper as getClassesToday} from "async/staff/dockhouse/ap-class-sessions";
import GeneticAsyncProvider, { ProviderWithSetState } from './ProviderType';

const defaultClassesToday: ProviderWithSetState<ApClassSession[]> = {
    state: [],
    setState: () => {},
    providerState: ProviderState.INITIAL
};

export const ClassesTodayContext = React.createContext(defaultClassesToday);

export default function ClassesTodayProvider(props: {children?: React.ReactNode}){
    return <GeneticAsyncProvider apiWrapper={getClassesToday} contextProvider={ClassesTodayContext.Provider}>{props.children}</GeneticAsyncProvider>
}