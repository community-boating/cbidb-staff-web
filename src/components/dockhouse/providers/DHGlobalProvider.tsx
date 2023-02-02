import { DHGlobals, MessagePriority } from 'async/staff/dockhouse/dh-globals';
import AsyncStateProvider from 'core/AsyncStateProvider';
import * as moment from 'moment';
import * as React from 'react';
import { getWrapper as getDHGlobals } from "async/staff/dockhouse/dh-globals";
import { none, some } from 'fp-ts/lib/Option';

const defaultDHGlobal: DHGlobals = {
    localTimeOffset: none,
    serverDateTime: moment(),
    sunsetTime: moment("19:43"),
    windSpeedAvg: 13,
    winDir: "W",
    announcements: [{
        priority: MessagePriority.LOW,
        message: "A MESSAGE"
    }],
    flagChanges: [{
        flag: "R",
        changeDatetime: moment()
    }]

}

const THRESH = 2000;

function derivedDHGlobal(global: DHGlobals): DHGlobals{
    const diff = global.serverDateTime.diff(moment());
    return {...global, localTimeOffset: diff < THRESH ? none : some(diff)}
}

export const DHGlobalContext = React.createContext(defaultDHGlobal);

export default function DHGlobalProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getDHGlobals} initState={defaultDHGlobal} postGet={derivedDHGlobal} refreshRate={30*1000} makeChildren={(state) => {return <DHGlobalContext.Provider value={state}>{props.children}</DHGlobalContext.Provider>}}/>
}