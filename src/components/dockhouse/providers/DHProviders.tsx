import { ActionModalProvider } from 'components/dockhouse/memberaction/ActionModal';
import ScannedPersonsCache from 'components/dockhouse/memberaction/ScannedPersonsCache';
import * as React from 'react';
import BoatsProvider from './BoatsProvider';
import ClassesProvider from './ClassesProvider';
import ClassTypesProvider from './ClassTypesProvider';
import DHGlobalProvider from './DHGlobalProvider';
import RatingsProvider from './RatingsProvider';

export default function DHProviders(props: {children?: React.ReactNode}){
    return <BoatsProvider>
        <RatingsProvider>
            <DHGlobalProvider>
                <ScannedPersonsCache>
                    <ActionModalProvider>
                        <ClassesProvider>
                            <ClassTypesProvider>
                                {props.children}
                            </ClassTypesProvider>
                        </ClassesProvider>
                    </ActionModalProvider>
                </ScannedPersonsCache>
            </DHGlobalProvider>
        </RatingsProvider>
    </BoatsProvider>
}