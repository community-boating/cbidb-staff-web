import { OptionalStringInput } from 'components/wrapped/Input';
import Menu, { DirectionX } from 'components/wrapped/Menu';
import { option } from 'fp-ts';
import * as React from 'react';
import { ChevronDown } from 'react-feather';

type SetNumberType = React.Dispatch<React.SetStateAction<option.Option<number>>>

export type SignoutNumbersDropdownProps = {
    numbers: option.Option<number | string>[]
    setNumber: (i: number, value: option.Option<number | string>) => void
}

const labels = ["Boat #", "Hull #", "Sail #"]

export default function (props: SignoutNumbersDropdownProps){
    return <div className="flex flex-row">
        <OptionalStringInput className="w-[76px]" tabIndex={4} label={labels[0]} controlledValue={props.numbers[0].map((a) => a.toString())} updateValue={(v) => {props.setNumber(0, v)}}/>
        <Menu className="" itemsClassName='bg-transparent' x={DirectionX.RIGHT}
        title={<ChevronDown/>}
        items={props.numbers.filter((a, i) => i > 0).map((a, i) => (
            <div key={i+1} onClick={(e) => {e.preventDefault();}}>
                <OptionalStringInput className="w-[100px] ml-auto mr-0 my-1" label={labels[i+1]} controlledValue={a.map((a) => a.toString())} updateValue={(v) => {props.setNumber(i+1, v)}}/>
            </div>
        ))}/>
    </div>
}