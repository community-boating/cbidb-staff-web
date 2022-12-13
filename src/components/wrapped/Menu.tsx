import * as React from 'react';

import { Menu, Transition } from '@headlessui/react';

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
    title: React.ReactNode;
    items: React.ReactNode[];
    x?: DirectionX;
    y?: DirectionY;
}

export default function Popover(props: PopoverProps){
    const positionClasses = (props.x == DirectionX.LEFT ? "left-0 " : "") + (props.x == DirectionX.RIGHT ? "right-0 " : "") + 
    (props.y == DirectionY.UP ? "top-0 " : "") + (props.y == DirectionY.DOWN ? "bottom-0 " : "");
    return (
        <div className="relative">
        <Menu>
            <Menu.Button className="h-full">{props.title}</Menu.Button>
            <Transition
        enter="transform transition duration-200"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transform duration-100 transition ease-in-out"
        leaveFrom="opacity-100 scale-100 "
        leaveTo="opacity-0 scale-95 "
      >
                <Menu.Items className={"absolute bg-white z-10 whitespace-nowrap " + positionClasses} static>
                    {props.items.map((a, i) => <div key={i} className={"" + i}><Menu.Item>{a}</Menu.Item></div>)}
                </Menu.Items>
            </Transition>
        </Menu>
        </div>
    );
}