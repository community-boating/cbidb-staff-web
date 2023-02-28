import AsyncStateProvider from 'core/AsyncStateProvider';
import * as moment from 'moment';
import * as React from 'react';
import { ApClassInstance, ApClassSession, getWrapper as getClassesToday} from "async/staff/dockhouse/ap-class-sessions";
import { none, some } from 'fp-ts/lib/Option';

const defaultClasses: ApClassSession[] = [];

export const ClassesTodayContext = React.createContext(defaultClasses);

export default function ClassesTodayProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getClassesToday} initState={[]} makeChildren={(state) => {return <ClassesTodayContext.Provider value={state}>{props.children}</ClassesTodayContext.Provider>}}/>
}