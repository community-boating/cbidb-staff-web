import { IncidentStatusTypes, incidentSubTypeMapping, IncidentSubTypes, IncidentType, IncidentTypes } from 'async/staff/dockhouse/incidents';
import { IncidentsContext } from 'async/providers/IncidentsProvider';
import Button from 'components/wrapped/Button';
import { OptionalNumberInput, OptionalStringInput, SelectInput, SelectOption } from 'components/wrapped/Input';
import { DefaultModalBody, ModalContext, ModalHeader } from 'components/wrapped/Modal';
import { option } from 'fp-ts';
import * as moment from "moment";
import { ValidatedTimeInput } from 'pages/dockhouse/signouts/SignoutsTable';
import * as React from 'react';
import { buttonClassActive, buttonClasses } from '../styles';
import { IncidentModalType } from './IncidentModalType';

const locationCoords = [
{W:42.3592, N:-71.0755},
{W:42.3565, N:-71.0804},
{W:42.3547, N:-71.0865},
{W:42.3605, N:-71.0778},
{W:42.3582, N:-71.0833},
{W:42.3570, N:-71.0880}]

const locations = [
"Water - Boston Longfellow",
"Water - Boston Mid River",
"Water - Boston Mass Ave",
"Water - Cambridge Longfellow",
"Water - Cambridge Mid River",
"Water - Cambridge Mass Ave",
"Water - First Barrier Island",
"Water - Second Barrier Island",
"Water - Boston Shoreline",
"Water - Cambridge Shoreline",
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
    "Radio - CBIRN CH1",
    "Radio - CBIRN CH2",
    "Radio - MARNE 72",
    "Radio - MARNE 16",
    "Radio - BFD/MetroFire",
    "Radio - BEMS/BAMA",
    "Radio - State Police/BAPERN",
    "Phone - Business Line",
    "Phone - Safety Line",
    "Directly Observed",
    "Directly Reported"
]

const responderPrimary = [
    "Sam",
    "Noah",
    "Evan",
    "Henry",
    "Olivia",
    "John",
    "Will",
    "Shannon",
    "Interim Safety Launch Operator Capt. Addison Antonelli"
]

const priorityClassNames = [
    "bg-[#ff1100]",
    "bg-[#ff5500]",
    "bg-[#ff7700]",
    "text-[#ff9900]",
    "text-[#ffbb00]",
    "text-[#009922]",
    "text-[#00ffff]",
    "text-[#006699]"
]

function SelectInputWithKey(props: {label?: string, className?: string, incident: IncidentType, setIncident: React.Dispatch<React.SetStateAction<IncidentType>>, col: keyof IncidentType, options: SelectOption<string>[]}){
    return <SelectInput className={props.className} label={props.label} controlledValue={props.incident[props.col] as any} updateValue={(v) => {
        props.setIncident((s) => {
            return ({...s, [props.col]: v});
        });
    }} selectOptions={props.options} fullWidth/>
}

const mapper = (a) => ({value: a, display: a})

const priorityList: string[] = [];

for(var i = 1; i <= 8; i++){
    priorityList.push(i.toString());
}

const locationsHR = locations.map(mapper);
const typesHR = Object.keys(IncidentTypes).map(mapper);
const subTypesHR = types.map(mapper);
const receivedHR = types.map(mapper);
const statusHR = Object.keys(IncidentStatusTypes).map(mapper);
const priorityHR = priorityList.map((a, i) => ({value: a, display: (sel, ac) => <div className={(sel) ? (priorityClassNames[i]) : "" + " w-full h-full"}>{a}</div>, isFunction: true}));

export default function IncidentModal(props: IncidentModalType){
    const [incident, setIncident] = React.useState(props.currentIncident);
    const incidents = React.useContext(IncidentsContext);
    React.useEffect(() => {
        if(incident.location.isSome()){
            const index = locations.indexOf(incident.location.value);
            if(index < locationCoords.length){
                setIncident((s) => ({...s, locationW: option.some(locationCoords[index].W), locationN: option.some(locationCoords[index].N)}))
            }
        }
    }, [incident.location]);
    React.useEffect(() => {
        if(incident.type.isSome() && incident.subtype.isSome()){
            const subtype = incident.subtype.value;
            const found = incidentSubTypeMapping[incident.type.value].find((a) => (a.subtype == subtype));
            if(found){
                setIncident((s) => ({...s, priority: option.some(found.priority.toString())}))
            }
        }
    }, [incident.subtype])
    const priorityClassName = incident.priority.isSome() ? priorityClassNames[parseInt(incident.priority.value) - 1] : "";
    return <DefaultModalBody>
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
            <SelectInputWithKey label="Subtype: "incident={incident} setIncident={setIncident} options={incident.type.isSome() ? incidentSubTypeMapping[incident.type.value].map((a) => ({value: a.subtype.toString(), display: IncidentSubTypes[a.subtype]})) : []} col="subtype"/>
            <SelectInputWithKey className={priorityClassName} label="Priority: " incident={incident} setIncident={setIncident} options={priorityHR} col="priority"/>
            <SelectInputWithKey label="Received Via: "incident={incident} setIncident={setIncident} options={receivedHR} col="received"/>
            <ValidatedTimeInput rowForEdit={incident} updateState={(a, b) => {setIncident((s) => ({...s, [a]: b}))}} validationResults={[]} columnId={'createdTime'} lower={moment().startOf('day')} upper={moment().endOf('day')}/>
            <SelectInputWithKey label="Status: "incident={incident} setIncident={setIncident} options={statusHR} col="status"/>
            <h1>@ Time: {}</h1>
            <OptionalStringInput label="Assigned Primary" controlledValue={incident.assignedResourcePrimary} updateValue={(v) => {setIncident((s) => ({...s, assignedResourcePrimary: v}))}} />
            <OptionalStringInput label="Assigned Secondary" controlledValue={incident.assignedResourcesOther} updateValue={(v) => {setIncident((s) => ({...s, assignedResourceOther: v}))}} />
        </div>
        <textarea rows={8} value={incident.description} onChange={(e) => {
            e.preventDefault();
            setIncident((s) => ({...s, description: e.target.value}));
        }}>

        </textarea>
        <ModalContext.Consumer>{value =>
            <Button className={buttonClasses + " " + buttonClassActive} onClick={(e) => {
                e.preventDefault();
                incidents.setState((b) => b.map((a) => {
                    if(a.id == incident.id)
                        return incident;
                    else
                        return a;
                }));
                value.setOpen(false);
            }}>Update Incident</Button>
        }</ModalContext.Consumer>
    </DefaultModalBody>
}