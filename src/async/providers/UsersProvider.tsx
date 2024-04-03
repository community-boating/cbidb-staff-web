import { UserType, getUsersWrapper } from 'async/staff/dockhouse/fotv-controller';
import { ProviderState } from 'core/AsyncStateProvider';
import * as React from 'react';
import GeneticAsyncProvider, { ProviderWithSetState } from './ProviderType';

const defaultUsers: ProviderWithSetState<UserType[]> = {state: [], setState: () => {}, providerState: ProviderState.INITIAL};

export const UsersContext = React.createContext(defaultUsers);

export default function UsersProvider(props: {children?: React.ReactNode}){
    return <GeneticAsyncProvider apiWrapper={getUsersWrapper} refreshRate={30*1000} contextProvider={UsersContext.Provider} initState={defaultUsers.state}>{props.children}</GeneticAsyncProvider>
}