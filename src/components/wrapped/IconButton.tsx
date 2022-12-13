import * as React from 'react';
import go from 'assets/img/icons/buttons/go.svg';


export default function IconButton(props: {src: any; onClick?: any;}){
    return <input type="image" src={props.src} className="rounded-md" onClick={props.onClick}/>;
}



export function GoButton(props){
    return <IconButton src={go} onClick={props.onClick}/>;
}