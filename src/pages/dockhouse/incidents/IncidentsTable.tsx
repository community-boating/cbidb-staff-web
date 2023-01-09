import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table } from 'components/table/Table';
import * as React from 'react';

type IncidentType = {
    id: number
    type: string
    priority: string
    status: string
    time: string
    location: string
    description: string
}

export type IncidentsTableProps = {
    incidents: IncidentType[];
};

const columns: ColumnDef<IncidentType, any>[] = [
{
    accessorKey: 'type',
},
{
    accessorKey: 'priority',
},
{
    accessorKey: 'status',
},
{
    accessorKey: 'time',
},
{
    accessorKey: 'location',
},
{
    accessorKey: 'description',
}
]

export default function IncidentsTable(props: IncidentsTableProps){
    return <Table keyField={'id'} rows={props.incidents} columns={columns}/>;
}