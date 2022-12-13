import * as React from 'react';

export type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    label?: React.ReactNode,
    end?: React.ReactNode,
    isEnd?: boolean,
    groupClassName?: string
}

export function Input(props: InputProps){
    const {isEnd, label, end, groupClassName, ...inputProps} = props;
    return <div className={"flex gap-2 " + (isEnd ? " self-end " : "") + groupClassName}><label>{label}</label><input className="rounded-md" {...inputProps}/>{end}</div>;
}