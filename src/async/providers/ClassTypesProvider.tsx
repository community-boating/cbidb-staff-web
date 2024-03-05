import AsyncStateProvider from 'core/AsyncStateProvider';
import * as moment from 'moment';
import * as React from 'react';
import { ApClassType } from 'models/typerefs';
import { none, some } from 'fp-ts/lib/Option';
import { getApClassTypes } from 'models/apiwrappers';

const defaultClassTypes: ApClassType[] = [];

export const ClassTypesContext = React.createContext(defaultClassTypes);

export default function ClassTypesProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getApClassTypes} initState={defaultClassTypes} makeChildren={(state) => {return <ClassTypesContext.Provider value={state}>{props.children}</ClassTypesContext.Provider>}}/>
}