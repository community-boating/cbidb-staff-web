import { ActionModalProvider } from 'components/dockhouse/memberaction/ActionModal';
import ScannedPersonsCache from 'components/dockhouse/memberaction/ScannedPersonsCache';
import * as React from 'react';
import BoatsProvider from './BoatsProvider';
import ClassesProvider from './ClassesProvider';
import ClassTypesProvider from './ClassTypesProvider';
import DHGlobalProvider from './DHGlobalProvider';
import RatingsProvider from './RatingsProvider';
import SignoutsTodayProvider from './SignoutsTodayProvider';

export default function DHProviders(props: {children?: React.ReactNode}){
    return <BoatsProvider>
        <RatingsProvider>
            <SignoutsTodayProvider>
                <DHGlobalProvider>
                    <ScannedPersonsCache>
                        <ClassesProvider>
                            <ClassTypesProvider>
                            <ActionModalProvider>
                                {props.children}
                                </ActionModalProvider>
                            </ClassTypesProvider>
                        </ClassesProvider>
                    </ScannedPersonsCache>
                </DHGlobalProvider>
            </SignoutsTodayProvider>
        </RatingsProvider>
    </BoatsProvider>
}