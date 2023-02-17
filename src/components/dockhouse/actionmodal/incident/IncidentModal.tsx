import { IncidentStatusTypes, incidentSubTypeMapping, IncidentSubTypes, IncidentType, IncidentTypes } from 'async/staff/dockhouse/incidents';
import { IncidentsContext } from 'components/dockhouse/providers/IncidentsProvider';
import Button from 'components/wrapped/Button';
import { OptionalNumberInput, OptionalStringInput, SelectInput, SelectOption } from 'components/wrapped/Input';
import { ModalContext, ModalHeader } from 'components/wrapped/Modal';
import * as moment from "moment";
import { ValidatedTimeInput } from 'pages/dockhouse/signouts/SignoutsTable';
import * as React from 'react';
import { buttonClassActive, buttonClasses, buttonClassInactive } from '../styles';
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

function SelectInputWithKey(props: {label?: string, incident: IncidentType, setIncident: React.Dispatch<React.SetStateAction<IncidentType>>, col: keyof IncidentType, options: SelectOption<string>[]}){
    return <SelectInput label={props.label} controlledValue={props.incident[props.col] as any} updateValue={(v) => {
        props.setIncident((s) => {
            console.log({...s, ...{[props.col]: v}});
            return ({...s, [props.col]: v});
        });
    }} selectOptions={props.options} fullWidth/>
}

const mapper = (a) => ({value: a, display: a})

const locationsHR = locations.map(mapper);
const typesHR = Object.keys(IncidentTypes).map(mapper);
const subTypesHR = types.map(mapper);
const receivedHR = types.map(mapper);
const statusHR = Object.keys(IncidentStatusTypes).map(mapper);

export default function IncidentModal(props: IncidentModalType){
    const [incident, setIncident] = React.useState(props.currentIncident);
    const incidents = React.useContext(IncidentsContext);
    return <div className="min-w-[90vw] min-h-[90vh] flex flex-col">
        <ModalHeader>
            <span className="text-2xl font-bold">New Incident:</span>
        </ModalHeader>
        <div className="grid grid-rows-4 grid-cols-2 grow-[1]">
            <SelectInputWithKey label="Location: " incident={incident} setIncident={setIncident} options={locationsHR} col="location"/>
            <div className="flex flex-row">
                <OptionalNumberInput label="GPS N" controlledValue={incident.locationN} updateValue={(v) => {setIncident((s) => ({...s, locationN: v}))}} />
                <OptionalNumberInput label="GPS W" controlledValue={incident.locationW} updateValue={(v) => {setIncident((s) => ({...s, locationW: v}))}} />
            </div>
            <SelectInputWithKey label="Type: " incident={incident} setIncident={setIncident} options={typesHR} col="type"/>
            <SelectInputWithKey label="Subtype: "incident={incident} setIncident={setIncident} options={incident.type.isSome() ? incidentSubTypeMapping[incident.type.value].map((a) => IncidentSubTypes[a]).map(mapper) : []} col="subtype"/>
            <SelectInputWithKey label="Received: "incident={incident} setIncident={setIncident} options={receivedHR} col="received"/>
            <ValidatedTimeInput rowForEdit={incident} updateState={(a, b) => {setIncident((s) => ({...s, [a]: b}))}} validationResults={[]} columnId={'createdTime'} lower={moment().startOf('day')} upper={moment().endOf('day')}/>
            <SelectInputWithKey label="Status: "incident={incident} setIncident={setIncident} options={statusHR} col="status"/>
            <h1>@ Time: {}</h1>
            <OptionalStringInput label="Assigned Primary" controlledValue={incident.assignedResourcePrimary} updateValue={(v) => {setIncident((s) => ({...s, assignedResourcePrimary: v}))}} />
            <OptionalStringInput label="Assigned Secondary" controlledValue={incident.assignedResourcesOther} updateValue={(v) => {setIncident((s) => ({...s, assignedResourceOther: v}))}} />
        </div>
        <textarea rows={20} value={incident.description} onChange={(e) => {
            e.preventDefault();
            setIncident((s) => ({...s, description: e.target.value}));
        }}>

        </textarea>
        <ModalContext.Consumer>{value =>
            <Button className={buttonClasses + " " + (props.wasNew ? buttonClassActive : buttonClassInactive)} onClick={(e) => {
                e.preventDefault();
                if(props.wasNew)
                    incidents.setState((b) => (b.concat(incident)));
                else
                    incidents.setState((b) => (b.map((a) => a.id == incident.id ? incident : a)));
                value.setOpen(false);
            }}>{props.wasNew ? "Add Incident" : "Update Incident"}</Button>
        }</ModalContext.Consumer>
    </div>
}