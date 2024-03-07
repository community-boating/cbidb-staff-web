import { ProviderState } from 'core/AsyncStateProvider';
import * as React from 'react';
import { getWrapper as getFOTV } from "async/staff/dockhouse/fotv-controller";
import { FOTVType } from 'async/staff/dockhouse/fotv-controller';
import GeneticAsyncProvider, { ProviderWithSetState } from './ProviderType';

const defaultFOTVProvider: ProviderWithSetState<FOTVType> = {
    state: {
        sunset: '',
        restrictions: [],
        restrictionGroups: [],
        logoImages: [],
        //images: [],
        restrictionConditions: [],
        activeProgramID: 0
    },
    setState: () => {},
    providerState: ProviderState.INITIAL
}

const THRESH = 2000;

export const FOTVContext = React.createContext(defaultFOTVProvider);

export default function FOTVProvider(props: {children?: React.ReactNode}){
    console.log("RuNNING");
    return <GeneticAsyncProvider apiWrapper={getFOTV} contextProvider={FOTVContext.Provider} initState={defaultFOTVProvider.state} refreshRate={15*1000}>{props.children}</GeneticAsyncProvider>
}