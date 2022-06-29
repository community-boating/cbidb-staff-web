import * as React from "react";
import * as t from 'io-ts';
import {classInstructorValidator} from 'async/rest/class-instructor'
import ReportWithModalForm from "components/ReportWithModalForm";
import {putWrapper as putInstructor} from "async/rest/class-instructor"
import { FormGroup, Label, Col, Input } from 'reactstrap';
import { StringifiedProps } from "util/StringifyObjectProps";
import { Column } from "react-table";
import { TableColumnOptionsCbi } from "react-table-config";

type ClassInstructor = t.TypeOf<typeof classInstructorValidator>;

export default function ManageClassInstructorsPage(props: { instructors: ClassInstructor[] }) {
	const columns: TableColumnOptionsCbi[] = [{
		accessor: "edit",
		Header: "",
		disableSortBy: true,
		width: 50,
	}, {
		accessor: "INSTRUCTOR_ID",
		Header: "ID",
		width: 80,
	}, {
		accessor: "NAME_FIRST",
		Header: "First Name",
		width: 300,
	}, {
		accessor: "NAME_LAST",
		Header: "Last Name",
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

	return <ReportWithModalForm
		rowValidator={classInstructorValidator}
		rows={props.instructors}
		primaryKey="INSTRUCTOR_ID"
		columns={columns}
		formComponents={formComponents}
		submitRow={putInstructor}
		cardTitle="Manage Instructors"
	/>;
}
