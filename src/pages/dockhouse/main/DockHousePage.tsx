import * as React from 'react';
import { CardLayout, Padding, Card, LayoutDirection } from '../../../components/dockhouse/Card';
import go from 'assets/img/go.svg';
import Modal, { ModalAction } from '../../../components/dockhouse/Modal';
import SelectInput from 'components/Input/SelectInput';
import { PopoverLocation, PopoverWithLabel } from 'components/dockhouse/Popover';

export default function DockHousePage (props) {
    const [inputState, setInputState] = React.useState("");
    const [state, setState] = React.useState({open: false, action: ModalAction.NONE});
    return (<>
     <CardLayout direction={LayoutDirection.VERTICAL} total={1} parentDirection={LayoutDirection.VERTICAL}>
        <Padding weight={0}/>
        <CardLayout direction={LayoutDirection.HORIZONTAL}>
            <CardLayout direction={LayoutDirection.VERTICAL}>
                <Card title="Member Actions">
                    <Input label={"Card Number:"}value={inputState} onChange={setInputState}/>
                </Card>
                <Card title="Program Status"></Card>
                <Card title="Testing"></Card>
            </CardLayout>
            <CardLayout direction={LayoutDirection.VERTICAL} weight={2}>
                <Card title="Dynamic Large View"></Card>
            </CardLayout>
            <CardLayout direction={LayoutDirection.VERTICAL}>
                <Card title="Incidents"></Card>
                <Card title="UAP Schedule"></Card>
                <Card title="Forms"></Card>
            </CardLayout>
        </CardLayout>
        <Card title="Active Signouts">
            <PopoverWithLabel location={PopoverLocation.DOWN} label={"Link"}><li>derp</li></PopoverWithLabel>
        </Card>
        <Card title="Completed Signouts">
            <button onClick={() => setState({open: true, action: ModalAction.OPEN})}>Open</button>
        </Card>
     </CardLayout>
     <Modal state={state} setState={setState} title={""}></Modal>
     </>);
};

type InputProps = {
    label: string,
    value: string,
    onChange: React.Dispatch<React.SetStateAction<string>>
}

function Input(props: InputProps){
    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = e.target.value;
        props.onChange(value);
    }
    return <div className="input-area"><label>{props.label}</label><input className="input" value={props.value} onChange={onChange}/><GoButton/></div>;
}

function GoButton(props){
    return <button className="gobutton"><img src={go}/></button>;
}