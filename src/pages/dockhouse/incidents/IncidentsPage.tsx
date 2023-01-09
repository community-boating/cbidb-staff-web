import { Card, CardLayout, FlexSize, LayoutDirection } from 'components/dockhouse/Card';
import * as React from 'react';
import IncidentsTable, { IncidentsTableProps } from './IncidentsTable';

const incident = {
    id: 0,
    type: "a type",
    priority: "low",
    status: "ongoing",
    time: "now",
    location: "somewhere",
    description: "i don't know"
}

const dummyIncidents: IncidentsTableProps['incidents'] = [incident, incident, incident];

export default function IncidentsPage(props) {
    return <>
        <CardLayout direction={LayoutDirection.VERTICAL}>
            <CardLayout direction={LayoutDirection.HORIZONTAL}>
                <Card title="Pending Incidents" weight={FlexSize.S_2}></Card>
                <Card title="Units"></Card>
            </CardLayout>
            <Card title="Assigned Incidents">
                <IncidentsTable incidents={dummyIncidents}></IncidentsTable>
            </Card>
            <Card title="Completed Incidents">

            </Card>
        </CardLayout>
    </>;
}