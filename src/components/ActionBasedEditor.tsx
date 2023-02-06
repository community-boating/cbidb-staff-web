import * as React from 'react';

export type EditAction<T_Data> = {
    applyAction: (data: T_Data) => T_Data
}

export type ActionBasedEditorState<T_Data> = {
    originalData: T_Data
    cachedModifiedData: T_Data
    actions: EditAction<T_Data>[]
}

export type ActionActionType<T_Data> = {
    addAction: (action: EditAction<T_Data>) => void, undo: () => void, reset: () => void
}

export type ActionBasedEditorProps<T_Data> = {
    originalData: T_Data
    makeChildren: (currentData: T_Data, actions: ActionActionType<T_Data>) => JSX.Element
}

function applyActions<T_Data>(data: T_Data, actions: EditAction<T_Data>[]){
    return actions.reduce((a, b) => b.applyAction(a), data);
}

export default function ActionBasedEditor<T_Data>(props: ActionBasedEditorProps<T_Data> & {actions: EditAction<T_Data>[], setActions: React.Dispatch<React.SetStateAction<EditAction<T_Data>[]>>}){
    const modifiedData = React.useMemo(() => applyActions(props.originalData, props.actions), [props.originalData, props.actions]);
    const addAction = (a: EditAction<T_Data>) => {
        props.setActions((s) => s.concat(a));
    }
    const undo = () => {
        props.setActions((s) => s.slice(0, -1));
    }
    const reset = () => {
        props.setActions([]);
    }
    return props.makeChildren(modifiedData, ({addAction, undo, reset}));
}