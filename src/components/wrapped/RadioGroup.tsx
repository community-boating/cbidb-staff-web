import { RadioGroup as RadioGroupHUI } from '@headlessui/react';
import { option } from 'fp-ts';
import * as React from 'react';

export type RadioGroupProps<T_Value> = {
    label?: React.ReactNode
    makeChildren: {value: T_Value, makeNode: (checked: boolean, setValue: (value: option.Option<T_Value>) => void) => React.ReactNode}[]
    value: option.Option<T_Value>
    setValue: (value: option.Option<T_Value>) => void
    keyListener?: (key: string) => void
    className?: string
}

export default function RadioGroup<T_Value>(props: RadioGroupProps<T_Value>){
    const ref = React.useRef<HTMLDivElement>();
    if(props.keyListener){
        React.useEffect(() => {
            ref.current.focus();
            ref.current.addEventListener("keydown", (e) => {
                props.keyListener(e.key);
            }) 
        }, []);
    }
    return <RadioGroupHUI value={props.value.getOrElse("" as any)} onChange={(e) => {props.setValue(option.some(e))}}>
        <RadioGroupHUI.Label>{props.label}</RadioGroupHUI.Label>
        <div ref={ref} className={props.className} tabIndex={0}>
            {props.makeChildren.map((a, i) => (<RadioGroupHUI.Option key={i} value={a.value} as={React.Fragment}>
                {({active, checked}) => <div key={i} className="flex">{a.makeNode(checked, props.setValue)}</div>}
            </RadioGroupHUI.Option>))}
        </div>
    </RadioGroupHUI>
} 