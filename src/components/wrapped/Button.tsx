import * as React from 'react';
import Spinner from './Spinner';

export type ButtonType = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    spinnerOnClick?: boolean,
    forceSpinner?: boolean,
    onSubmit?: (e: React.EventHandler<React.MouseEvent<HTMLButtonElement>>) => Promise<void>,
}

export default function Button(props: ButtonType){
    const {spinnerOnClick,forceSpinner,onSubmit,onClick,children, ...buttonProps} = props;
    const [spinning, setSpinning] = React.useState(true);
    if(spinnerOnClick && (forceSpinner != undefined)){
        React.useEffect(() => {
            //setSpinning(forceSpinner);
        }, [forceSpinner]);
    }
    var useClick = onClick;
    if(spinnerOnClick && onSubmit != undefined){
        useClick = (e) => {e.preventDefault(); setSpinning(true); onSubmit.apply(e).then(setSpinning(false))};
    }
    const useChildren = <>{children}{spinning ? <Spinner/> : ""}</>
    return <><button className="flex flex-row whitespace-nowrap" {...buttonProps} onClick={useClick} children={useChildren}/>{}</>;
}