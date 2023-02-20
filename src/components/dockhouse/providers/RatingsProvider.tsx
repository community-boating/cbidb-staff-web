import AsyncStateProvider from 'core/AsyncStateProvider';
import * as React from 'react';
import { RatingsType, getRatings } from 'async/staff/dockhouse/ratings';

const defaultRatings: RatingsType = [];

export const RatingsContext = React.createContext(defaultRatings);

export default function RatingsProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getRatings} initState={defaultRatings} makeChildren={(state) => {console.log("drawing", state.length); return <RatingsContext.Provider value={state}>{props.children}</RatingsContext.Provider>}}/>
}