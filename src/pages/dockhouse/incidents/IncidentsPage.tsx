import { IncidentStatusTypes } from 'async/staff/dockhouse/incidents';
import { Card, CardLayout, FlexSize, LayoutDirection } from 'components/dockhouse/Card';
import { IncidentsContext } from 'async/providers/IncidentsProvider';
import { option } from 'fp-ts';
import * as React from 'react';
import IncidentsTable from './IncidentsTable';
import { IncidentDLVType } from 'components/dockhouse/actionmodal/view-incidents/ViewIncidentsType';

function isMultiple(status: option.Option<IncidentStatusTypes>, multi: IncidentStatusTypes[]){
    return status.isSome() && multi.some((a) => status.value == a);
}

export function isPending(status: option.Option<IncidentStatusTypes>){
    return isMultiple(status, [IncidentStatusTypes.INPUT, IncidentStatusTypes.PENDING])
}

export function isAssigned(status: option.Option<IncidentStatusTypes>){
    return isMultiple(status, [IncidentStatusTypes.ASSIGNED, IncidentStatusTypes.ARRIVED, IncidentStatusTypes.CLEAR])
}

export function isComplete(status: option.Option<IncidentStatusTypes>){
    return isMultiple(status, [IncidentStatusTypes.COMPLETE, IncidentStatusTypes.REPORT_TO_FOLLOW])
}

export default function IncidentsPage(props: {dlvType?: IncidentDLVType, isDLV?: boolean}) {
    const incidents = React.useContext(IncidentsContext);
    console.log(props.isDLV);
    console.log(props.dlvType);
    return <>
        <CardLayout direction={LayoutDirection.VERTICAL}>
            {(!props.isDLV || props.dlvType == IncidentDLVType.PENDING) ? <CardLayout direction={LayoutDirection.HORIZONTAL}>
                <Card title="Pending Incidents" weight={FlexSize.S_2}>
                    <IncidentsTable incidents={incidents.state.filter((a) => isPending(a.status))}></IncidentsTable>
                </Card>
                <Card title="Resources"></Card>
            </CardLayout> : <></>}
            {(!props.isDLV || props.dlvType == IncidentDLVType.ASSIGNED) ? <Card title="Assigned Incidents">
                <IncidentsTable incidents={incidents.state.filter((a) => isAssigned(a.status))}></IncidentsTable>
            </Card> : <></>}
            {(!props.isDLV || props.dlvType == IncidentDLVType.COMPLETED) ? <Card title="Completed Incidents">
            <IncidentsTable incidents={incidents.state.filter((a) => isComplete(a.status))}></IncidentsTable>
            </Card> : <></>}
        </CardLayout>
    </>;
}