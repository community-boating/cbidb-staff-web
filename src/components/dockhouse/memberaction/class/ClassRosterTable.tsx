
import { ColumnDef } from '@tanstack/table-core';
import { ClassType } from 'async/staff/dockhouse/get-classes';
import { Table } from 'components/table/Table';
import { InteractiveColumnDef, InteractiveColumnInjector } from 'components/table/InteractiveColumnInjector';
import * as React from 'react';
import { ActionClassType } from '../ActionModalProps';

const columnsInteractive: InteractiveColumnDef<ClassType['$$apClassSignups'][number], {}, {}>[] = [{
    accessorKey: '$$person.nameFirst',
    header: "Name First"
},
{
    accessorKey: '$$person.nameLast',
    header: "Name Last"
},
{
    accessorKey: '$$person.name',
    header: "Name First"
},
];

export default function ClassRosterTable(props: ActionClassType){
    const columnInjector = React.useMemo(() => new InteractiveColumnInjector(columnsInteractive), []);
    const columns = React.useMemo(() => columnInjector.provideColumns({}), []);
    return <Table rows={props.currentClass.$$apClassSignups} columns={columns} keyField="signupId"/>;
}