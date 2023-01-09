import * as React from "react";
import * as t from 'io-ts';
import {classInstructorValidator} from 'async/rest/class-instructor'
import TableWithModalForm, { TableWithModalFormStringified } from "components/table/TableWithModalForm";
import {putWrapper as putInstructor} from "async/rest/class-instructor"
import { FormGroup, Label, Col, Input } from 'reactstrap';
import { StringifiedProps } from "util/StringifyObjectProps";
import { ColumnDef } from "@tanstack/react-table";

type ClassInstructor = t.TypeOf<typeof classInstructorValidator>;

export default function ManageClassInstructorsPage(props: { instructors: ClassInstructor[] }) {
	const columns: ColumnDef<ClassInstructor, any>[] = [
	{
		accessorKey: "INSTRUCTOR_ID",
		header: "ID",
		size: 80,
	}, {
		accessorKey: "NAME_FIRST",
		header: "First Name",
		size: 300,
	}, {
		accessorKey: "NAME_LAST",
		header: "Last Name",
	}];

	const formComponents = (rowForEdit: StringifiedProps<ClassInstructor>, updateState: (id: string, value: string | boolean) => void) => <React.Fragment>
		<FormGroup row>
			<Label sm={2} className="text-sm-right">
				ID
			</Label>
			<Col sm={10} >
				<div style={{textAlign: "left", padding: "5px 14px"}}>
					{rowForEdit.INSTRUCTOR_ID || "(none)"}
				</div>
			</Col>
		</FormGroup>
		<FormGroup row>
			<Label sm={2} className="text-sm-right">
				First Name
			</Label>
			<Col sm={10}>
				<Input
					type="text"
					name="nameFirst"
					placeholder="First Name"
					value={rowForEdit.NAME_FIRST}
					onChange={event => updateState("NAME_FIRST", event.target.value)}
				/>
			</Col>
		</FormGroup>
		<FormGroup row>
			<Label sm={2} className="text-sm-right">
				Last Name
			</Label>
			<Col sm={10}>
				<Input
					type="text"
					name="nameLast"
					placeholder="Last Name"
					id="nameLast"
					value={rowForEdit.NAME_LAST}
					onChange={event => updateState("NAME_LAST", event.target.value)}
				/>
			</Col>
		</FormGroup>
	</React.Fragment>;

	return <TableWithModalFormStringified
		validator={classInstructorValidator}
		rows={props.instructors}
		keyField="INSTRUCTOR_ID"
		columns={columns}
		formComponents={formComponents}
		action={putInstructor}
		cardTitle="Manage Instructors"
	/>;
}
