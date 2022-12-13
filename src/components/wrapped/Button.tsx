import * as React from 'react';
import Spinner from './Spinner';

export type ButtonType = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    spinnerOnClick?: boolean,
    forceSpinner?: boolean,
    onSubmit?: (e: React.EventHandler<React.MouseEvent<HTMLButtonElement>>) => Promise<any>,
}

export default function Button(props: ButtonType){
    const {spinnerOnClick,forceSpinner,onSubmit,onClick,children, ...buttonProps} = props;
    const [spinning, setSpinning] = React.useState(false);
    if(spinnerOnClick && (forceSpinner != undefined)){
        React.useEffect(() => {
            setSpinning(forceSpinner);
        }, [forceSpinner]);
    }
    var useClick = onClick;
    if(spinnerOnClick && onSubmit != undefined){
        useClick = (e) => {e.preventDefault(); setSpinning(true); onSubmit.apply(e).then(() => {setSpinning(false)})};
    }
    const useChildren = <div className="flex flex-row whitespace-nowrap">{children}{spinning ? <Spinner/> : ""}</div>
    return <><button {...buttonProps} onClick={useClick} children={useChildren}/>{}</>;
}