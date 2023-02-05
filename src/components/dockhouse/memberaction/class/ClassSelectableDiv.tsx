import * as React from 'react';


export type SelectedType = {
    [key: string]: boolean;
};
export function selectKeySignout(signoutId: number): string {
    return "signout." + signoutId;
}
export function selectKeySignoutPerson(signoutId: number, personId: number): string {
    return "signout.person." + signoutId + "." + personId;
}
export function selectKeyRosterPerson(personId: number) {
    return "roster." + personId;
}

export enum SelectType{
    ADD,REMOVE,TOGGLE
}

export type SelectedInnerType = {
    selectingInner?: boolean
    setSelectingInner?: React.Dispatch<React.SetStateAction<boolean>>
}

type SetSelectedType = React.Dispatch<React.SetStateAction<SelectedType>>;
export type ClassBoatListActions = {
    selected: SelectedType
    add: SetSelectedType
    remove: SetSelectedType
    set: SetSelectedType
    selectType?: SelectType
    setSelectType?: React.Dispatch<React.SetStateAction<SelectType>>
};

export const NON_SELECTABLE_CLASS_NAME = "non-selectable";

export function SelectableDiv(props: { thisSelect: SelectedType; children?: React.ReactNode; makeNoSelectChildren?: (ref: React.RefObject<HTMLDivElement>) => React.ReactNode, isInner?: boolean, onClick?: () => void, className?: string} & SelectedInnerType & ClassBoatListActions) {
    const isSelected = !Object.keys(props.thisSelect).some((a) => !props.selected[a]);
    const ref = React.createRef<HTMLDivElement>();
    const thisDown = React.useRef<NodeJS.Timeout>();
    const isSelectedWrapped = ((props.selectType == undefined || props.selectType == SelectType.TOGGLE) ? isSelected : props.selectType == SelectType.REMOVE);
    const clearThisDown = () => {
        if(thisDown.current){
            clearTimeout(thisDown.current);
            thisDown.current = undefined;
        }
    }
    const groupSelect = () => {
        if(isSelectedWrapped){
            props.remove(props.thisSelect);
        }else{
            props.add(props.thisSelect);
        }
    }
    const singleSelect = () => {
        if (isSelectedWrapped) {
            props.remove(props.thisSelect);
        } else {
            props.set(props.thisSelect);
        }
    }
    const isNonSelectableArea = (target) =>{
        if(target instanceof HTMLElement){
            return ref.current && ref.current.contains(target);
        }
        return false;
    }
    return <div className={"border-2 w-full h-full select-none flex flex-row border-r-[30px] overflow-visible cursor-cell " + (isSelected ? "border-red-200" : "") + " " + (props.className || "")}
    onMouseDown={(e) => {
        if(isNonSelectableArea(e.target))
            return;
        e.preventDefault();
        e.stopPropagation();
        props.setSelectType && props.setSelectType(isSelected ? SelectType.REMOVE : SelectType.ADD);
        if(props.onClick){
            thisDown.current = setTimeout(() => {
                if(thisDown.current){
                    singleSelect();
                    thisDown.current = undefined;
                }
            }, 600);
        }else{
            singleSelect();
        }
        if (props.isInner) {
            props.setSelectingInner && props.setSelectingInner(true);
        } else {
            props.setSelectingInner && props.setSelectingInner(false);
        }
    }}
    onMouseUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
        props.setSelectType && props.setSelectType(undefined);
        if(thisDown.current){
            //groupSelect();
            clearThisDown();
            props.onClick();
        }
    }}
    onMouseLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if(thisDown.current){
            singleSelect();
            clearThisDown();
        }
    }}
    onMouseEnter={(e) => {
        if (e.buttons == 1 && (props.selectingInner == undefined || (props.isInner == props.selectingInner))) {
            e.preventDefault();
            e.stopPropagation();
            groupSelect();
        }
    }}>
        {props.makeNoSelectChildren && props.makeNoSelectChildren(ref)}
        {props.children}
    </div>;
}
