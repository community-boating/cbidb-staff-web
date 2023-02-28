import { IncidentStatusTypes } from 'async/staff/dockhouse/incidents';
import { Card, CardLayout, FlexSize, LayoutDirection } from 'components/dockhouse/Card';
import { IncidentsContext } from 'async/providers/IncidentsProvider';
import { option } from 'fp-ts';
import * as React from 'react';
import IncidentsTable from './IncidentsTable';

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

export default function IncidentsPage(props) {
    const incidents = React.useContext(IncidentsContext);
    return <>
        <CardLayout direction={LayoutDirection.VERTICAL}>
            <CardLayout direction={LayoutDirection.HORIZONTAL}>
                <Card title="Pending Incidents" weight={FlexSize.S_2}>
                    <IncidentsTable incidents={incidents.state.filter((a) => isPending(a.status))}></IncidentsTable>
                </Card>
                <Card title="Resources"></Card>
            </CardLayout>
            <Card title="Assigned Incidents">
                <IncidentsTable incidents={incidents.state.filter((a) => isAssigned(a.status))}></IncidentsTable>
            </Card>
            <Card title="Completed Incidents">
            <IncidentsTable incidents={incidents.state.filter((a) => isComplete(a.status))}></IncidentsTable>
            </Card>
        </CardLayout>
    </>;
}