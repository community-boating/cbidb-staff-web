import * as React from 'react';

export type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    label?: React.ReactNode,
    end?: React.ReactNode,
    isEnd?: boolean
}

export function Input(props: InputProps){
    const {isEnd, label, end, ...inputProps} = props;
    return <div className={"flex mt-auto gap-2 " + (isEnd ? " self-end" : "")}><label>{label}</label><input className="rounded-md" {...inputProps}/>{end}</div>;
}