import { ActionModalProvider } from 'components/dockhouse/actionmodal/ActionModal';
import ScannedPersonsCache from 'components/dockhouse/actionmodal/ScannedPersonsCache';
import * as React from 'react';
import BoatsProvider from './BoatsProvider';
import AllClassesProvider from './AllClassesProvider';
import ClassLocationsProvider from './ClassLocationsProvider';
import ClassTypesProvider from './ClassTypesProvider';
import DHGlobalProvider from './DHGlobalProvider';
import IncidentsProvider from './IncidentsProvider';
import InstructorsProvider from './InstructorsProvider';
import RatingsProvider from './RatingsProvider';
import SignoutsTodayProvider from './SignoutsTodayProvider';
import ClassesTodayProvider from './ClassesTodayProvider';

const providersList = [
    ActionModalProvider,
    BoatsProvider,
    RatingsProvider,
    SignoutsTodayProvider,
    DHGlobalProvider,
    InstructorsProvider,
    //IncidentsProvider,
    ClassLocationsProvider,
    ScannedPersonsCache,
    AllClassesProvider,
    ClassesTodayProvider,
    ClassTypesProvider,
]

export default function DHProviders(props: {children?: React.ReactNode}){
    var child = props.children;
    for(var provider of providersList){
        child = React.createElement(provider, {children: child});
    }
    return <>{child}</>;
}