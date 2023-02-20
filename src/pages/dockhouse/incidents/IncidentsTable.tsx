import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { IncidentType } from 'async/staff/dockhouse/incidents';
import { ActionModalContext } from 'components/dockhouse/actionmodal/ActionModal';
import { ActionEditIncident } from 'components/dockhouse/actionmodal/incident/IncidentModalType';
import { Table } from 'components/table/Table';
import * as React from 'react';
import { CellOptionBase, CellOptionTime } from 'util/tableUtil';

export type IncidentsTableProps = {
    incidents: IncidentType[];
};

const columns: ColumnDef<IncidentType, any>[] = [
{
    header: "Type",
    accessorKey: 'type',
    cell: CellOptionBase("None")
},
{
    header: "Priority",
    accessorKey: 'priority',
    cell: CellOptionBase("None")
},
{
    header: "Status",
    accessorKey: 'status',
    cell: CellOptionBase("None")
},
{
    header: "Received On",
    accessorKey: 'createdTime',
    cell: CellOptionTime
},
{
    header: "Location",
    accessorKey: 'location',
    cell: CellOptionBase("None")
},
{
    header: "Description",
    accessorKey: 'description',
}
]

export default function IncidentsTable(props: IncidentsTableProps){
    const actionModal = React.useContext(ActionModalContext);
    return <Table keyField={'id'} rows={props.incidents} columns={columns} openEditRow={(r) => {
        actionModal.pushAction(new ActionEditIncident(r));
    }}/>;
}