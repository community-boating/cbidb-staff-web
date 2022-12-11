import * as React from 'react';
import { CardLayout, Card, LayoutDirection, FlexSize, CardOrButton } from '../../../components/dockhouse/Card';
import go from 'assets/img/icons/buttons/go.svg';
import Modal, { ModalAction } from '../../../components/wrapped/Modal';

import { Transition } from '@headlessui/react'

export default function DockHousePage (props) {
    const [inputState, setInputState] = React.useState("");
    const [state, setState] = React.useState(false);
    const [derp, setDerp] = React.useState(false);
    const derpPP = 0;
    return (<>
     <CardLayout direction={LayoutDirection.VERTICAL} parentDirection={LayoutDirection.VERTICAL}>
        <CardLayout direction={LayoutDirection.HORIZONTAL}>
            <CardLayout direction={LayoutDirection.VERTICAL}>
                <CardOrButton title="Member Actions" button={<div><input className="object-fill" type="image" src={go}/></div>}>
                    <Input label={"Card Number:"} value={inputState} onChange={setInputState}/>
                </CardOrButton>
                <Card title="Program Status"></Card>
                <Card title="Testing"></Card>
            </CardLayout>
            <CardLayout direction={LayoutDirection.VERTICAL} weight={FlexSize.S_2}>
                <Card title="Dynamic Large View"></Card>
            </CardLayout>
            <CardLayout direction={LayoutDirection.VERTICAL}>
                <Card title="Incidents"></Card>
                <Card title="UAP Schedule"></Card>
                <Card title="Forms"></Card>
            </CardLayout>
        </CardLayout>
        <Card title="Active Signouts">
            <button className="place-self-start" onClick={() => setDerp(!derp)}>Toggle Derp</button>
            <Transition 
            appear={true}
            show={derp}
            enter="transition-opacity duration-750"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-750"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"><p>Testing the fade</p></Transition>
        </Card>
        <Card title="Completed Signouts">
            <button className="place-self-start" onClick={() => setState(true)}>Open</button>
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
    return <div className="flex mt-auto place-self-end gap-2"><label>{props.label}</label><input className="rounded-md" value={props.value} onChange={onChange}/><GoButton/></div>;
}

function GoButton(props){
    return <input type="image" src={go} className="rounded-md"/>;
}