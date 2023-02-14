import * as React from 'react';

import { Menu as MenuHUI, Transition } from '@headlessui/react';
import Button from './Button';

export enum DirectionX {
    NONE = 0,
    LEFT = 1,
    RIGHT = 2
} 

export enum DirectionY {
    NONE = 0,
    UP = 1,
    DOWN = 2
}

export type DropDownProps = {
    x?: DirectionX
    y?: DirectionY
    horizontal?: boolean
}

type Menu = DropDownProps & {
    title: React.ReactNode
    items: React.ReactNode[]
    className?: string
    itemsClassName?: string
    itemClassName?: string
}

export function getPositionClassOuter(props: DropDownProps){
    return ((props.x == DirectionX.LEFT ? "left-0 " : "") + (props.x == DirectionX.RIGHT ? "right-0 " : "") + 
    (props.y == DirectionY.UP ? "top-0 " : "") + (props.y == DirectionY.DOWN ? "bottom-0 " : "") + (props.horizontal ? " w-[0]" : "w-full"));
}

export function getPositionClassInner(props: DropDownProps){
    return ("flex " + (props.horizontal ? "flex-row w-max" : "flex-col w-full"));
}

export default function Menu(props: Menu){
    return (
        <div className={"relative " + (props.className || "")}>
            <MenuHUI>
                {({close}) => (<>
                <MenuHUI.Button className={(props.className || "")}>{props.title}</MenuHUI.Button>
                <Transition
            className={(props.className || "")}
            enter="transform transition duration-200"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 scale-100"
            leave="transform duration-100 transition ease-in-out"
            leaveFrom="opacity-100 scale-100 "
            leaveTo="opacity-0 scale-95 "
        >
                    <MenuHUI.Items className={"absolute bg-white z-50 whitespace-nowrap flex min-w-fit " + (props.itemsClassName || "") + " " + getPositionClassOuter(props)} static>
                        <div className={getPositionClassInner(props)}>
                            {props.items.map((a, i) => <MenuHUI.Item key={i}><div className={(props.itemClassName || "")}>{a}</div></MenuHUI.Item>)}
                        </div>
                    </MenuHUI.Items>
                </Transition></>)}
            </MenuHUI>
        </div>
    );
}