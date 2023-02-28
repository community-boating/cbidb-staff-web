import AsyncStateProvider from 'core/AsyncStateProvider';
import * as moment from 'moment';
import * as React from 'react';
import { ApClassInstance, ApClassSession, getAllWrapper as getClasses} from "async/staff/dockhouse/ap-class-sessions";
import { none, some } from 'fp-ts/lib/Option';

const defaultClasses: ApClassSession[] = [];

export const AllClassesContext = React.createContext(defaultClasses);

export default function AllClassesProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getClasses} initState={[]} makeChildren={(state) => {return <AllClassesContext.Provider value={state.flatMap((a) => (a.$$apClassSessions.map((b) => ({...b, $$apClassInstance: {...a, $$apClassSignups: []}}))))}>{props.children}</AllClassesContext.Provider>}}/>
}