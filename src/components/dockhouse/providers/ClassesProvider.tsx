import AsyncStateProvider from 'core/AsyncStateProvider';
import * as moment from 'moment';
import * as React from 'react';
import { ClassType, getWrapper as getClasses } from "async/staff/dockhouse/get-classes";
import { none, some } from 'fp-ts/lib/Option';

const defaultClasses: ClassType[] = [];

export const ClassesContext = React.createContext(defaultClasses);

export default function ClassesProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getClasses} initState={defaultClasses} makeChildren={(state) => {return <ClassesContext.Provider value={state}>{props.children}</ClassesContext.Provider>}}/>
}