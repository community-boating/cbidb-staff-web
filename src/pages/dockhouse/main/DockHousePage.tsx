import * as React from 'react';
import { CardLayout, Card, LayoutDirection, FlexSize, CardOrButton } from '../../../components/dockhouse/Card';
import Modal from '../../../components/wrapped/Modal';
import { Transition } from '@headlessui/react'
import { Input } from 'components/wrapped/Input';
import { GoButton } from 'components/wrapped/IconButton';
import { toastr } from 'react-redux-toastr';

export default function DockHousePage (props) {
    const [inputState, setInputState] = React.useState("");
    return (<>
     <CardLayout direction={LayoutDirection.VERTICAL} parentDirection={LayoutDirection.VERTICAL}>
        <CardLayout direction={LayoutDirection.HORIZONTAL}>
            <CardLayout direction={LayoutDirection.VERTICAL}>
                <CardOrButton title="Member Actions" button={<div><input className="object-fill" type="image" src={""}/></div>}>
                    <Input label={"Card Number:"} end={<GoButton/>} isEnd={true} value={inputState} onChange={(e) => {setInputState(e.target.value)}}/>
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
        </Card>
        <Card title="Completed Signouts">
        </Card>
     </CardLayout>
     </>);
};