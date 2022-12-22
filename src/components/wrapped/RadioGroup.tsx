import { RadioGroup as RadioGroupHUI } from '@headlessui/react';
import * as React from 'react';

export type RadioGroupProps<T_Value> = {
    label?: React.ReactNode
    children: {value: T_Value, makeNode: (checked: boolean, setValue: (value: T_Value) => void) => React.ReactNode}[]
    value: T_Value
    setValue: (value: T_Value) => void
    className?: string
}

export default function RadioGroup<T_Value>(props: RadioGroupProps<T_Value>){
    const ref = React.useRef<HTMLDivElement>();
    React.useEffect(() => {
        ref.current.focus();
        console.log("hand");
        ref.current.addEventListener("keydown", () => {
            console.log("happening");
        }) 
    }, []);
    return <RadioGroupHUI value={props.value || ""} onChange={props.setValue}>
        <RadioGroupHUI.Label>{props.label}</RadioGroupHUI.Label>
        <div ref={ref} className={props.className}>
            {props.children.map((a, i) => (<RadioGroupHUI.Option key={i} value={a.value} as={React.Fragment}>
                {({active, checked}) => <div key={i} className="flex min-w-[100px]">{a.makeNode(checked, props.setValue)}</div>}
            </RadioGroupHUI.Option>))}
        </div>
    </RadioGroupHUI>
} 