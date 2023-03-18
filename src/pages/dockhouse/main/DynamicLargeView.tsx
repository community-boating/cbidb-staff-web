import { Action } from 'components/dockhouse/actionmodal/ActionModalProps';
import { BoatQueueAction } from 'components/dockhouse/actionmodal/boatqueue/BoatQueueType';
import { ActionChooseClass } from 'components/dockhouse/actionmodal/class/ActionChooseClassType';
import ChooseClassModal from 'components/dockhouse/actionmodal/class/ChooseClassModal';
import { RentalsAction } from 'components/dockhouse/actionmodal/rentals/RentalsType';
import { EditTestsAction } from 'components/dockhouse/actionmodal/test/EditTestsType';
import { ActionViewIncidents, IncidentDLVType } from 'components/dockhouse/actionmodal/view-incidents/ViewIncidentsType';
import { Card, CardTitleWithGearDropdown, GearIcon } from 'components/dockhouse/Card';
import Menu from 'components/wrapped/Menu';
import * as React from 'react';

const actions = [
    {action: new ActionViewIncidents(IncidentDLVType.PENDING), label: "Pending Incidents"},
    {action: new ActionViewIncidents(IncidentDLVType.ASSIGNED), label: "Assigned Incidents"},
    {action: new ActionViewIncidents(IncidentDLVType.COMPLETED), label: "Completed Incidents"},
    {action: new EditTestsAction(), label: "Tests"},
    {action: new ActionChooseClass(), label: "Classes"},
    {action: new BoatQueueAction(), label: "Boat Queue"},
    {action: new RentalsAction(), label: "Rentals"}
    
]

export function DynamicLargeView(props){
    const [action, setAction] = React.useState<Action<any, any>>(undefined);
    const [state, setState] = React.useState(undefined);
    
    return <Card title={<Menu title={<GearIcon/>} items={actions.map((a) => <a onClick={(e) => {
        setAction(a.action);
    }}>{a.label}</a>)}/>}>
        {action && action.createModalContent(action.modeInfo, state, setState, true)}
    </Card>;
}