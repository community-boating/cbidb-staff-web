import { IncidentType } from 'async/staff/dockhouse/incidents';
import { IncidentsContext } from 'components/dockhouse/providers/IncidentsProvider';
import Button from 'components/wrapped/Button';
import { OptionalNumberInput, SelectInput, SelectOption } from 'components/wrapped/Input';
import { ModalContext, ModalHeader } from 'components/wrapped/Modal';
import * as moment from "moment";
import { ValidatedTimeInput } from 'pages/dockhouse/signouts/SignoutsTable';
import * as React from 'react';
import { CustomInput } from 'reactstrap';
import { buttonClassActive, buttonClasses } from '../styles';
import { IncidentModalType } from './IncidentModalType';

const locations = [
"Dock - Front of Dock",
"Dock - Longfellow Dock",
"Dock - Main Dock",
"Dock - Dockhouse",
"Dock - Pavilion",
"Dock - Pavilion N",
"Dock - Pavilion S",
"Dock - Maintenance",
"Building - “The Boathouse” 21 David G Mugar Way, Boston MA 02114",
"Building - 1st FLR",
"Building - Front Office",
"Building - Men’s Bathroom",
"Building - Women’s Bathroom",
"Building - Main Bay",
"Building - Bay 1",
"Building - Bay 5",
"Building - Maintenance",
"Building - Storage Rm/Sail Loft",
"Building - Front Stair",
"Building - Rear Stair",
"Building - 2nd FLR",
"Building - 2nd FLR Function Room",
"Building - 2nd FLR Conference Room",
"Building - 2nd FLR Executive Office",
"Building - 2nd FLR Administration Office",
"Unknown Location"
]

const types = [
    "A type",
    "other type"
]

const subtypes = [
    "A type",
    "other type"
]

const received = [
    "A",
    "B",
    "C"
]

function SelectInputWithKey(props: {incident: IncidentType, setIncident: React.Dispatch<React.SetStateAction<IncidentType>>, key: keyof IncidentType, options: SelectOption<string>[]}){
    return <SelectInput controlledValue={props.incident.location} updateValue={(v) => {
        props.setIncident((s) => ({...s, location: v}));
    }} selectOptions={props.options} fullWidth/>
}

const mapper = (a) => ({value: a, display: a})

const locationsHR = locations.map(mapper);
const typesHR = types.map(mapper);
const subTypesHR = types.map(mapper);
const receivedHR = types.map(mapper);

export default function IncidentModal(props: IncidentModalType){
    const wasNew = props.currentIncident == undefined;
    const [incident, setIncident] = React.useState(props.currentIncident);
    const incidents = React.useContext(IncidentsContext);
    var i = 0;
    return <div className="min-w-[90vw] min-h-[90vh] flex flex-col">
        <ModalHeader>
            <span className="text-2xl font-bold">New Incident:</span>
        </ModalHeader>
        <div className="grid grid-rows-4 grid-cols-2">
            <SelectInputWithKey incident={incident} setIncident={setIncident} options={locationsHR} key="location"/>
            <div className="flex flex-row">
                <OptionalNumberInput controlledValue={incident.locationN} updateValue={(v) => {setIncident((s) => ({...s, locationN: v}))}} />
                <OptionalNumberInput controlledValue={incident.locationW} updateValue={(v) => {setIncident((s) => ({...s, locationW: v}))}} />
            </div>
            <SelectInputWithKey incident={incident} setIncident={setIncident} options={typesHR} key="type"/>
            <SelectInputWithKey incident={incident} setIncident={setIncident} options={subTypesHR} key="subtype"/>
            <SelectInputWithKey incident={incident} setIncident={setIncident} options={receivedHR} key="received"/>
            <ValidatedTimeInput rowForEdit={incident} updateState={(a, b) => {setIncident((s) => ({...s, [a]: b}))}} validationResults={[]} columnId={'createdTime'} lower={moment().startOf('day')} upper={moment().endOf('day')}/>
        </div>
        <ModalContext.Consumer>{value =>
            <Button className={buttonClasses + buttonClassActive} onClick={(e) => {
                e.preventDefault();
                incidents.setState((s) => (s.concat(incident)));
                value.setOpen(false);
            }}>Add Incident</Button>
        }</ModalContext.Consumer>
    </div>
}