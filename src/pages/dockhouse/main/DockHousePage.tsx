import * as React from 'react';
import { CardLayout, Card, LayoutDirection, FlexSize, CardOrButton } from '../../../components/dockhouse/Card';
import { Input } from 'components/wrapped/Input';
import { GoButton } from 'components/wrapped/IconButton';
import MemberActionModal from '../modals/MemberActionModal';

export default function DockHousePage (props) {
    const [inputState, setInputState] = React.useState("");
    const [open, setOpen] = React.useState(false);
    return (<>
     <CardLayout direction={LayoutDirection.VERTICAL} parentDirection={LayoutDirection.VERTICAL}>
        <CardLayout direction={LayoutDirection.HORIZONTAL}>
            <CardLayout direction={LayoutDirection.VERTICAL}>
                <CardOrButton title="Member Actions" button={<div><input className="object-fill" type="image" src={""}/></div>}>
                    <Input label={"Card Number:"} end={<GoButton onClick={() => {setOpen(true);}}/>} isEnd={true} groupClassName="mt-auto" value={inputState} onChange={(e) => {setInputState(e.target.value)}} onEnter={() => {setOpen(true);}}/>
                </CardOrButton>
                <Card title="One Day Rentals"></Card>
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
     <MemberActionModal open={open} setOpen={setOpen}/>
     </>);
};