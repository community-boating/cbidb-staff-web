import * as React from 'react';
import BoatsProvider from './BoatsProvider';
import DHGlobalProvider from './DHGlobalProvider';
import RatingsProvider from './RatingsProvider';

export default function DHProviders(props: {children?: React.ReactNode}){
    return <BoatsProvider>
        <RatingsProvider>
            <DHGlobalProvider>
                {props.children}
            </DHGlobalProvider>
        </RatingsProvider>
    </BoatsProvider>
}