import { option } from 'fp-ts';
import * as React from 'react';
import { ScannedCrewType } from './ActionModal';
import { getWrapper } from 'async/staff/dockhouse/scan-card';
import { AppStateContext } from 'app/state/AppStateContext';

export const ScannedPersonsCacheContext = React.createContext<ScannedPersonsCacheGet>({getCached: undefined})

export type CachedScans = {
    [key: string]: ScannedCrewType[number]
}

export type ScannedPersonsCacheProps = {
    children?: React.ReactNode
}

export type ScannedPersonsCacheGet = {
    getCached: (cardNum: string) => option.Option<ScannedCrewType[number]>
}

export default function ScannedPersonsCache(props){
    const [cachedScans, setCachedScans] = React.useState<CachedScans>({});
    const asc = React.useContext(AppStateContext);
    const scanning = React.useRef({});
    const cacheGet = {
        getCached: (cardNum: string) => {
            const cached = cachedScans[cardNum];
            if(cached){
                return option.some(cached);
            }else{
                if(!scanning.current[cardNum]){
                    scanning.current[cardNum] = true;
                    getWrapper(cardNum).send(asc).then((a) => {
                        if(a.type == "Success"){
                            setCachedScans((s) => ({...s, ...{[cardNum]: a.success}}));
                        }else{
                            console.log(a);
                        }
                    })
                }
            }
            return option.none;
        }
    }

    return <ScannedPersonsCacheContext.Provider value={cacheGet}>
        {props.children}
    </ScannedPersonsCacheContext.Provider>
}