import { PermissionType, UserType, getPermissionsWrapper, getUsersWrapper } from 'async/staff/dockhouse/fotv-controller';
import { ProviderState } from 'core/AsyncStateProvider';
import * as React from 'react';
import GeneticAsyncProvider, { ProviderWithSetState } from './ProviderType';

const defaultPermissions: ProviderWithSetState<PermissionType[]> = {state: [], setState: () => {}, providerState: ProviderState.INITIAL};

export const PermissionsContext = React.createContext(defaultPermissions);

export default function PermissionsProvider(props: {children?: React.ReactNode}){
    return <GeneticAsyncProvider apiWrapper={getPermissionsWrapper} refreshRate={30*1000} contextProvider={PermissionsContext.Provider} initState={defaultPermissions.state}>{props.children}</GeneticAsyncProvider>
}