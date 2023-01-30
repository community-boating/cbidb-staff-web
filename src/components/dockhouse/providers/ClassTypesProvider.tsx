import AsyncStateProvider from 'core/AsyncStateProvider';
import * as moment from 'moment';
import * as React from 'react';
import { ClassTypeType, getWrapper as getClassTypes } from "async/staff/dockhouse/class-types";
import { none, some } from 'fp-ts/lib/Option';

const defaultClassTypes: ClassTypeType[] = [];

export const ClassTypesContext = React.createContext(defaultClassTypes);

export default function ClassTypesProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getClassTypes} initState={defaultClassTypes} makeChildren={(state) => {return <ClassTypesContext.Provider value={state}>{props.children}</ClassTypesContext.Provider>}}/>
}