import * as React from 'react';

type ModalState = {
    open: boolean
}

type DockHouseModalProps = {
    children?: React.ReactNode;
    title: React.ReactNode;
    state: ModalState
    setState?: React.Dispatch<React.SetStateAction<ModalState>>;
}

export default function DockHouseModal(props: DockHouseModalProps){
    const [state, setState] = (props.setState != undefined) ? [props.state, props.setState] : React.useState(props.state);
    React.useEffect(() => {
        const keyboardListener = (e: KeyboardEvent) => {
            if(e.key == "Escape"){
                setState({open: false});
            }
        }
        document.body.addEventListener("keydown", keyboardListener);
        return () => {
            document.body.removeEventListener("keydown", keyboardListener);
        }
    })
    React.useEffect(() => {
        console.log("running");
        document.body.style.filter = ((state.open == true) ? "blur(5px)" : "blur(0)");
        return () => {
            document.body.style.filter = "blur(0)";
        };
    }, [state.open]);
    if(state.open){
        return (<div className="modalBlur"><div className="modalContent">{props.children}</div></div>);
    }else{
        return <></>;
    }
}