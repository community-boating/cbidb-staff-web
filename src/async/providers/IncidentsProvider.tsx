import AsyncStateProvider from 'core/AsyncStateProvider';
import * as React from 'react';
import { IncidentType, getWrapper } from 'async/staff/dockhouse/incidents';

const defaultIncidentsType: {state: IncidentType[], setState: React.Dispatch<React.SetStateAction<IncidentType[]>>} = {
    state: [],
    setState: (a) => {}
};

export const IncidentsContext = React.createContext(defaultIncidentsType);

export default function IncidentsProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getWrapper} initState={[]} makeChildren={(state, setState) => {return <IncidentsContext.Provider value={{state, setState}}>{props.children}</IncidentsContext.Provider>}}/>
}