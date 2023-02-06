import { ColumnDef } from '@tanstack/react-table';
import { getBoatTypes } from 'async/staff/dockhouse/boats';
import { SignoutTablesState } from 'async/staff/dockhouse/signouts';
import { TestType } from 'async/staff/dockhouse/tests';
import { Table } from 'components/table/Table';
import { SelectInput } from 'components/wrapped/Input';
import { ModalHeader } from 'components/wrapped/Modal';
import { option } from 'fp-ts';
import { testResultsHR } from 'pages/dockhouse/signouts/Constants';
import * as React from 'react';
import { BoatSelect } from '../BoatIcon';
import { EditTestsType } from './EditTestsType';

type SignoutWithTests = SignoutTablesState & {tests: (TestType)[]};

const columns: ColumnDef<SignoutWithTests>[] = [{
    accessorKey: "boatType",
    header: "Boat Type",
    cell: (v) => {
        return <div className="w-min mx-auto"><BoatSelect boatId={option.some(v.row.original.boatId)} setBoatId={undefined} autoWidth/></div>
    }
},
{
    header: "Name First",
    cell: (v) => {
        return <div className="flex flex-col">{v.row.original.tests.map((a, i) => <div key={"s" + i} className="">{a.nameFirst}</div>)}</div>
    }
},
{
    header: "Name Last",
    cell: (v) => {
        return <div className="flex flex-col">{v.row.original.tests.map((a, i) => <div key={"a" + i} className="">{a.nameLast}</div>)}</div>
    }
},
{
    header: "Test Result",
    cell: (v) => { 
        return <div className="flex flex-col">{v.row.original.tests.map((a, i) => <div key={"d" + i} className="w-min mx-auto"><SelectInput controlledValue={a.testResult} updateValue={undefined} selectOptions={testResultsHR} autoWidth/></div>)}</div>
    }
}
]

export default function EditTestsModal(props: EditTestsType){
    var i = 0;
    const signoutsWithTests = props.testingSignouts.map((a) => ({...a, tests: props.tests.filter((b) => a.signoutId == b.signoutId)}));
    return <div className="min-w-[90vw] min-h-[90vh] flex flex-col">
        <ModalHeader>
            <span className="text-2xl font-bold">Edit Tests</span>
        </ModalHeader>
        <div className="grow-[1] w-full bg-white">
            <Table rows={signoutsWithTests} columns={columns} keyField="signoutId"/>
        </div>
    </div>
}