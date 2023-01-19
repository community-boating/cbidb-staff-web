import * as React from 'react';
import Spinner from './Spinner';

export type ButtonType = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    spinnerOnClick?: boolean
    forceSpinner?: boolean
    submit?: (e: React.EventHandler<React.MouseEvent<HTMLButtonElement>>) => Promise<any>
    activeClass?: string
    active?: boolean
    className?: string
}

export default function Button(props: ButtonType){
    const {spinnerOnClick,forceSpinner,submit,onClick,children,className,active,activeClass,...buttonProps} = props;
    const [spinning, setSpinning] = React.useState(false);
    if(spinnerOnClick && (forceSpinner != undefined)){
        React.useEffect(() => {
            setSpinning(forceSpinner);
        }, [forceSpinner]);
    }
    var useClick = onClick;
    if(submit != undefined){
        useClick = (e) => {spinnerOnClick && setSpinning(true); submit.apply(e).then(() => {spinnerOnClick && setSpinning(false)})};
    }
    const useChildren = <div className={(props.className || "")}>{children}{spinning ? <Spinner/> : ""}</div>
    return <><button {...buttonProps} onClick={(e) => {e.preventDefault(); if(useClick) useClick(e);}} className={className + ((props.activeClass && props.active) ? (" " + props.activeClass) : "")} children={useChildren}/>{}</>;
}