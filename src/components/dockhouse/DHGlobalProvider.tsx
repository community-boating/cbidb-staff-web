import { DHGlobals } from 'async/staff/dockhouse/dh-globals';
import AsyncStateProvider from 'core/AsyncStateProvider';
import * as moment from 'moment';
import * as React from 'react';
import { DefaultDateTimeFormat } from 'util/OptionalTypeValidators';

import { getWrapper as getDHGlobals } from "async/staff/dockhouse/dh-globals";

const defaultDHGlobal: DHGlobals = {
    serverDateTime: moment(),
    sunsetTime: moment("19:43"),
    windSpeedAvg: 13,
    winDir: "W",
    announcements: [{
        priority: "low",
        message: "A MESSAGE"
    }],
    flagChanges: [{
        flag: "R",
        changeDatetime: moment()
    }]

}

export const DHGlobalContext = React.createContext(defaultDHGlobal);

export default function DHGlobalProvider(props: {children?: React.ReactNode}){
    
    return <AsyncStateProvider apiWrapper={getDHGlobals} makeChildren={(state) => {console.log(state); return <DHGlobalContext.Provider value={state}>{props.children}</DHGlobalContext.Provider>}}/>
}