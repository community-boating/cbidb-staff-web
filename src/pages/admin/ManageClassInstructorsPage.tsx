import * as React from "react";
import * as t from 'io-ts';
import {classInstructorValidator} from 'async/rest/class-instructor'
import ReportWithModalForm from "components/ReportWithModalForm";
import {putWrapper as putInstructor} from "async/rest/class-instructor"
import { FormGroup, Label, Col, Input } from 'reactstrap';
import { StringifiedProps } from "util/StringifyObjectProps";
import { ColumnDef } from "@tanstack/react-table";

type ClassInstructor = t.TypeOf<typeof classInstructorValidator>;

export default function ManageClassInstructorsPage(props: { instructors: ClassInstructor[] }) {
	const columns: ColumnDef<ClassInstructor, any>[] = [
	{
		accessorKey: "instructorId",
		header: "ID",
		size: 80,
	}, {
		accessorKey: "nameFirst",
		header: "First Name",
		size: 300,
	}, {
		accessorKey: "nameLast",
		header: "Last Name",
	}];

	const formComponents = (rowForEdit: StringifiedProps<ClassInstructor>, updateState: (id: string, value: string | boolean) => void) => <React.Fragment>
		<FormGroup row>
			<Label sm={2} className="text-sm-right">
				ID
			</Label>
			<Col sm={10} >
				<div style={{textAlign: "left", padding: "5px 14px"}}>
					{rowForEdit.instructorId || "(none)"}
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
					value={rowForEdit.nameFirst}
					onChange={event => updateState("nameFirst", event.target.value)}
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
					value={rowForEdit.nameLast}
					onChange={event => updateState("nameLast", event.target.value)}
				/>
			</Col>
		</FormGroup>
	</React.Fragment>;

	return <ReportWithModalForm
		rowValidator={classInstructorValidator}
		rows={props.instructors}
		primaryKey="instructorId"
		columns={columns}
		formComponents={formComponents}
		submitRow={putInstructor}
		cardTitle="Manage Instructors"
	/>;
}
