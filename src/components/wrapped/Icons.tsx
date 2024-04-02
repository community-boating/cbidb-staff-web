import * as React from 'react';
import { X } from 'react-feather';

export default function CloseIcon(props: React.SVGAttributes<SVGAElement>){
    const {stroke, className, ...other} = props;
    return <X stroke="red" className={(className || "") + " cursor-pointer"} {...other}/>;
}