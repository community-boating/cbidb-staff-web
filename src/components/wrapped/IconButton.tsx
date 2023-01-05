import * as React from 'react';
import go from 'assets/img/icons/buttons/go.svg';


export default function IconButton(props: {src: any; onClick?: any; className?: string}){
    const onClick = (e) => {e.preventDefault(); if(props.onClick) props.onClick(e)}
    return <input type="image" src={props.src} className={"rounded-md " + props.className} onClick={onClick}/>;
}



export function GoButton(props){
    return <IconButton src={go} onClick={props.onClick}/>;
}