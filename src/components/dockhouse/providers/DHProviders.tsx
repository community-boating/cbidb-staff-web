import { ActionModalProvider } from 'components/dockhouse/actionmodal/ActionModal';
import ScannedPersonsCache from 'components/dockhouse/actionmodal/ScannedPersonsCache';
import * as React from 'react';
import BoatsProvider from './BoatsProvider';
import ClassesProvider from './ClassesProvider';
import ClassLocationsProvider from './ClassLocationsProvider';
import ClassTypesProvider from './ClassTypesProvider';
import DHGlobalProvider from './DHGlobalProvider';
import IncidentsProvider from './IncidentsProvider';
import InstructorsProvider from './InstructorsProvider';
import RatingsProvider from './RatingsProvider';
import SignoutsTodayProvider from './SignoutsTodayProvider';

export default function DHProviders(props: {children?: React.ReactNode}){
    return <BoatsProvider>
        <RatingsProvider>
            <SignoutsTodayProvider>
                <DHGlobalProvider>
                    <InstructorsProvider>
                        <IncidentsProvider>
                            <ClassLocationsProvider>
                                <ScannedPersonsCache>
                                    <ClassesProvider>
                                        <ClassTypesProvider>
                                            <ActionModalProvider>
                                                {props.children}
                                            </ActionModalProvider>
                                        </ClassTypesProvider>
                                    </ClassesProvider>
                                </ScannedPersonsCache>
                            </ClassLocationsProvider>
                        </IncidentsProvider>
                    </InstructorsProvider>
                </DHGlobalProvider>
            </SignoutsTodayProvider>
        </RatingsProvider>
    </BoatsProvider>
}