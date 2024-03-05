import { option } from 'fp-ts';
import * as React from 'react';
import { AppStateContext } from 'app/state/AppStateContext';
import { ScannedCrewType } from 'models/typerefs';
import { getScanCard } from 'models/apiwrappers';

export const ScannedPersonsCacheContext = React.createContext<ScannedPersonsCacheGet>({getCached: undefined})

export type CachedScans = {
    [key: string]: option.Option<ScannedCrewType[number]>
}

export type ScannedPersonsCacheProps = {
    children?: React.ReactNode
}

export type ScannedPersonsCacheGet = {
    getCached: (cardNum: string, onResponse?: (result: option.Option<ScannedCrewType[number]>) => void) => option.Option<ScannedCrewType[number]>
}

export default function ScannedPersonsCache(props){
    const [cachedScans, setCachedScans] = React.useState<CachedScans>({});
    const asc = React.useContext(AppStateContext);
    const scanning = React.useRef({});
    const cacheGet = {
        getCached: (cardNum: string, onResponse?: (result: option.Option<ScannedCrewType[number]>) => void) => {
            const cached = cachedScans[cardNum];
            if(cached){
                onResponse && onResponse(cached);
                return cached;
            }else{
                if(!scanning.current[cardNum]){
                    scanning.current[cardNum] = getScanCard(cardNum).send(asc).then((a) => {
                        const result: option.Option<ScannedCrewType[number]> = a.type == "Success" ? option.some(a.success) : option.none;
                        setCachedScans((s) => ({...s, ...{[cardNum]: result}}));
                        onResponse && onResponse(result);
                    })
                }else{
                    scanning.current[cardNum].then((a) => {
                        const result: option.Option<ScannedCrewType[number]> = a.type == "Success" ? option.some(a.success) : option.none;
                        onResponse && onResponse(result);
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