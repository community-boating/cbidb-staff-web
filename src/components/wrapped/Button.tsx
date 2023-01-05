import * as React from 'react';
import Spinner from './Spinner';

export type ButtonType = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    spinnerOnClick?: boolean,
    forceSpinner?: boolean,
    onSubmit?: (e: React.EventHandler<React.MouseEvent<HTMLButtonElement>>) => Promise<any>,
    activeClass?: string
    active?: boolean
}

export default function Button(props: ButtonType){
    const {spinnerOnClick,forceSpinner,onSubmit,onClick,children,className,active,activeClass,...buttonProps} = props;
    const [spinning, setSpinning] = React.useState(false);
    if(spinnerOnClick && (forceSpinner != undefined)){
        React.useEffect(() => {
            setSpinning(forceSpinner);
        }, [forceSpinner]);
    }
    var useClick = onClick;
    if(spinnerOnClick && onSubmit != undefined){
        useClick = (e) => {setSpinning(true); onSubmit.apply(e).then(() => {setSpinning(false)})};
    }
    const useChildren = <div className="flex flex-row whitespace-nowrap">{children}{spinning ? <Spinner/> : ""}</div>
    return <><button {...buttonProps} onClick={(e) => {e.preventDefault(); if(useClick) useClick(e);}} className={className + ((props.activeClass && props.active) ? (" " + props.activeClass) : "")} children={useChildren}/>{}</>;
}