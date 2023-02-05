import * as React from 'react';
import { ButtonProps, Button } from 'reactstrap';

export const buttonClasses = "px-5 py-2";
export const buttonClassActive = "bg-boathouseblue text-gray-100";
export const buttonClassInactive = "bg-gray-300";

export function ButtonStyled(props: ButtonProps & {active?: boolean}){
    return <Button {...props} className={buttonClasses + " " + (props.active? buttonClassActive : buttonClassInactive)}/>
}