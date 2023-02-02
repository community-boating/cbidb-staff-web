import AsyncStateProvider from 'core/AsyncStateProvider';
import * as React from 'react';
import { InstructorType, getWrapper } from 'async/rest/class-instructor';

const defaultInstructors: InstructorType[] = [];

export const InstructorsContext = React.createContext(defaultInstructors);

export default function InstructorsProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getWrapper} initState={defaultInstructors} makeChildren={(state) => {return <InstructorsContext.Provider value={state}>{props.children}</InstructorsContext.Provider>}}/>
}