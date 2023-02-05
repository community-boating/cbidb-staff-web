import * as React from 'react';
import { buttonClasses, buttonClassInactive } from './dockhouse/memberaction/styles';
import Button from './wrapped/Button';

export type Action<T_Data> = {
    applyAction: (data: T_Data) => T_Data
}

export type ActionBasedEditorState<T_Data> = {
    originalData: T_Data
    cachedModifiedData: T_Data
    actions: Action<T_Data>[]
}

export type ActionActionType<T_Data> = {
    addAction: (action: Action<T_Data>) => void, undo: () => void, reset: () => void
}

export type ActionBasedEditorProps<T_Data> = {
    originalData: T_Data
    makeChildren: (currentData: T_Data, actions: ActionActionType<T_Data>) => JSX.Element
}

function applyActions<T_Data>(data: T_Data, actions: Action<T_Data>[]){
    return actions.reduce((a, b) => b.applyAction(a), data);
}

export default function ActionBasedEditor<T_Data>(props: ActionBasedEditorProps<T_Data>){
    const [actions, setActions] = React.useState<Action<T_Data>[]>([]);
    const modifiedData = React.useMemo(() => applyActions(props.originalData, actions), [props.originalData, actions]);
    const addAction = (a: Action<T_Data>) => {
        setActions((s) => s.concat(a));
    }
    const undo = () => {
        setActions((s) => s.slice(0, -1));
    }
    const reset = () => {
        setActions([]);
    }
    return props.makeChildren(modifiedData, ({addAction, undo, reset}));
}