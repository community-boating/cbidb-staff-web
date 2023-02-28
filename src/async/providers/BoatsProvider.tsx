import AsyncStateProvider from 'core/AsyncStateProvider';
import * as React from 'react';
import { BoatTypesType, getBoatTypes } from 'async/staff/dockhouse/boats';

const defaultBoatTypes: BoatTypesType = [];

export const BoatsContext = React.createContext(defaultBoatTypes);

export default function BoatsProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getBoatTypes} initState={defaultBoatTypes} makeChildren={(state) => {return <BoatsContext.Provider value={state}>{props.children}</BoatsContext.Provider>}}/>
}