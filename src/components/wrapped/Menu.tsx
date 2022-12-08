import * as React from 'react';

import { Menu, Transition } from '@headlessui/react';

type PopoverProps = {
    title: React.ReactNode;
    items: React.ReactNode[];
}

export default function Popover(props: PopoverProps){
    
    return (
        <Menu>
            <Menu.Button>{props.title}</Menu.Button>
            <Transition
        enter="transform transition duration-200"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transform duration-100 transition ease-in-out"
        leaveFrom="opacity-100 scale-100 "
        leaveTo="opacity-0 scale-95 "
      >
                <Menu.Items className="absolute right-0 bottom-0 bg-white" static>
                    {props.items.map((a, i) => <div key={i} className={"" + i}><Menu.Item>{a}</Menu.Item></div>)}
                </Menu.Items>
            </Transition>
        </Menu>
    );
}