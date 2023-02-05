import AsyncStateProvider from 'core/AsyncStateProvider';
import * as React from 'react';
import { ClassLocationType, getWrapper as getClassLocations } from "async/rest/class-locations";

const defaultClassLocations: ClassLocationType[] = [];

export const ClassLocationsContext = React.createContext(defaultClassLocations);

export default function ClassLocationsProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getClassLocations} initState={defaultClassLocations} makeChildren={(state) => {return <ClassLocationsContext.Provider value={state}>{props.children}</ClassLocationsContext.Provider>}}/>
}