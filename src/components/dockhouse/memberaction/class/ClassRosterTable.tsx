
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
    header: "Attendance",
    cell: () => <button>Here</button>
},

];

export default function ClassRosterTable(props: ActionClassType){
    const personIdsOnWater: {[key: number]: true} = {};
    props.associatedSignouts.forEach((a) => {
        personIdsOnWater[a.$$skipper.personId] = true;
        a.$$crew.forEach((b) => {
            personIdsOnWater[b.$$person.personId] = true;
        })
    })
    const columnInjector = React.useMemo(() => new InteractiveColumnInjector(columnsInteractive), []);
    const columns = React.useMemo(() => columnInjector.provideColumns({}), []);
    return <Table rows={props.currentClass.$$apClassSignups.filter((a) => !personIdsOnWater[a.$$person.personId])} columns={columns} keyField="signupId"/>;
}