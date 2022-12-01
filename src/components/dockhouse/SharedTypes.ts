import * as React from 'react';

export type StateAndSet<T_State> = {
    state: T_State,
    setState?: React.Dispatch<React.SetStateAction<T_State>>
};

export function setStatePartial<T_State>(state: T_State, partialState: Partial<T_State>) : T_State {
    return Object.assign(Object.assign({}, state), partialState);
}