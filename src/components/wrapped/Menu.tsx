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

type PopoverProps = {
    title: React.ReactNode
    items: React.ReactNode[]
    x?: DirectionX
    y?: DirectionY
    className?: string
    itemsClassName?: string
    itemClassName?: string
}

type ButtonMenuProps<T_Item> = {
    itemAction: (item: T_Item) => void
    items: {node: React.ReactNode, value: T_Item}[]
} & Omit<PopoverProps, 'items'>;

export function ButtonMenu<T_Item>(props: ButtonMenuProps<T_Item>){
    const {itemAction, items, ...other} = props;
    return <Menu {...other} items={items.map((a, i) => <Button className="h-full" onClick={() => {itemAction(a.value);}}>{a.node}</Button>)}/>
}

export default function Menu(props: PopoverProps){
    const positionClasses = (props.x == DirectionX.LEFT ? "left-0 " : "") + (props.x == DirectionX.RIGHT ? "right-0 " : "") + 
    (props.y == DirectionY.UP ? "top-0 " : "") + (props.y == DirectionY.DOWN ? "bottom-0 " : "");
    return (
        <div className={"relative " + (props.className || "")}>
            <MenuHUI>
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
                    <MenuHUI.Items className={"absolute bg-white z-50 whitespace-nowrap flex flex-col " + (props.itemsClassName || "") + " " + positionClasses} static>
                        {props.items.map((a, i) => <MenuHUI.Item key={i}><div className={(props.itemClassName || "")}>{a}</div></MenuHUI.Item>)}
                    </MenuHUI.Items>
                </Transition>
            </MenuHUI>
        </div>
    );
}