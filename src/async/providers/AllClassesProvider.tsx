import AsyncStateProvider from 'core/AsyncStateProvider';
import * as moment from 'moment';
import * as React from 'react';
import { ApClassInstanceWithSignups, ApClassInstance, ApClassSessionWithInstance} from "models/typerefs";
import { getApClassInstancesThisSeason } from 'models/apiwrappers';

const defaultClasses: ApClassInstance[] = [];

export const AllClassesContext = React.createContext(defaultClasses);

export default function AllClassesProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getApClassInstancesThisSeason} initState={[]} makeChildren={(state) => {return <AllClassesContext.Provider value={state}>{props.children}</AllClassesContext.Provider>}}/>
}