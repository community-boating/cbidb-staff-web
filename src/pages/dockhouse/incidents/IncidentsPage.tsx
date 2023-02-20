import { IncidentStatusTypes } from 'async/staff/dockhouse/incidents';
import { Card, CardLayout, FlexSize, LayoutDirection } from 'components/dockhouse/Card';
import { IncidentsContext } from 'components/dockhouse/providers/IncidentsProvider';
import * as React from 'react';
import IncidentsTable, { IncidentsTableProps } from './IncidentsTable';

export default function IncidentsPage(props) {
    const incidents = React.useContext(IncidentsContext);
    return <>
        <CardLayout direction={LayoutDirection.VERTICAL}>
            <CardLayout direction={LayoutDirection.HORIZONTAL}>
                <Card title="Pending Incidents" weight={FlexSize.S_2}></Card>
                <Card title="Units"></Card>
            </CardLayout>
            <Card title="Assigned Incidents">
                <IncidentsTable incidents={incidents.state.filter((a) => a.status.isSome() && a.status.value == IncidentStatusTypes.PENDING)}></IncidentsTable>
            </Card>
            <Card title="Completed Incidents">
            </Card>
        </CardLayout>
    </>;
}