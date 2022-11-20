import * as React from 'react';
import * as moment from 'moment';
import Header from './Header';
import { DockHouseCardLayout, Padding, DockHouseCard, LayoutDirection } from './DockHouseCard';
import go from 'assets/img/go.svg';
import DockHouseModal from './DockHouseModal';

export default function DockHousePage (props) {
    const [inputState, setInputState] = React.useState("");
    const [openState, setOpenState] = React.useState({open: false});
    const buttons = [
        {short: "I M S", long: "INCIDENTS", onClick: (a) => {alert("clicked IMS")}},
        {short: "CAP", long: "CAPSIZE", onClick: (a) => {alert("clicked CAP")}},
        {short: "GND", long: "AGROUND", onClick: (a) => {alert("clicked GND")}},
        {short: "AST", long: "ASSIST", onClick: (a) => {alert("clicked AST")}}];
    return (<><Header flag={"R"} time={moment()} sunset={moment("2022-11-16T00:43:00Z")} speed={13} direction={"W"}
     high={{title: "Announcement Title Here", message: "Click for announcement modal blah blah"}}
     medium={{title: "", message: "Medium priority announcement"}}
     low={[{title: "", message: "low priority announcement"}, {title: "", message: "scroll blah blah"}]}
     buttons={buttons}
     ></Header>
     <DockHouseCardLayout direction={LayoutDirection.VERTICAL} total={1} parentDirection={LayoutDirection.VERTICAL}>
        <Padding weight={0}/>
        <DockHouseCardLayout direction={LayoutDirection.HORIZONTAL}>
            <DockHouseCardLayout direction={LayoutDirection.VERTICAL}>
                <DockHouseCard title="Member Actions">
                    <DockHouseInput label={"Card Number:"}value={inputState} onChange={setInputState}/>
                    <DockHouseGoButton></DockHouseGoButton>
                </DockHouseCard>
                <DockHouseCard title="Program Status"></DockHouseCard>
                <DockHouseCard title="Testing"></DockHouseCard>
            </DockHouseCardLayout>
            <DockHouseCardLayout direction={LayoutDirection.VERTICAL} weight={2}>
                <DockHouseCard title="Dynamic Large View"></DockHouseCard>
            </DockHouseCardLayout>
            <DockHouseCardLayout direction={LayoutDirection.VERTICAL}>
                <DockHouseCard title="Incidents"></DockHouseCard>
                <DockHouseCard title="UAP Schedule"></DockHouseCard>
                <DockHouseCard title="Forms"></DockHouseCard>
            </DockHouseCardLayout>
        </DockHouseCardLayout>
        <DockHouseCard title="Active Signouts"></DockHouseCard>
        <DockHouseCard title="Completed Signouts"></DockHouseCard>
     </DockHouseCardLayout>
     <DockHouseModal title={"yolo"} state={openState} setState={setOpenState}>Derp</DockHouseModal>
     <button onClick={(a) => {setOpenState({open: true})}}>Open</button>
     </>);
};

type DockHouseInputProps = {
    label: string,
    value: string,
    onChange: React.Dispatch<React.SetStateAction<string>>
}

function DockHouseInput(props: DockHouseInputProps){
    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = e.target.value;
        props.onChange(value);
    }
    return <><label>{props.label}</label><input className="dockhouseinput" value={props.value} onChange={onChange}/></>;
}

function DockHouseGoButton(props){
    return <button className="dockhousegobutton"><img src={go}/></button>;
}