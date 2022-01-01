import * as React from "react";
import * as t from 'io-ts';
import { tableColWidth } from '@util/tableUtil';
import {classInstructorValidator} from '@async/rest/class-instructor'
import { ColumnDescription } from "react-bootstrap-table-next";
import ReportWithModalForm from "@components/ReportWithModalForm";
import {putWrapper as putInstructor} from "@async/rest/class-instructor"
import { Form, Col } from 'react-bootstrap';
import { StringifiedProps } from "@util/StringifyObjectProps";

type ClassInstructor = t.TypeOf<typeof classInstructorValidator>;

export default function ManageClassInstructorsPage(props: { instructors: ClassInstructor[] }) {
	const columns: ColumnDescription[] = [{
		dataField: "edit",
		text: "",
		...tableColWidth(50),
	}, {
		dataField: "INSTRUCTOR_ID",
		text: "ID",
		sort: true,
		...tableColWidth(80),
	}, {
		dataField: "NAME_FIRST",
		text: "First Name",
		sort: true,
		...tableColWidth(300),
	}, {
		dataField: "NAME_LAST",
		text: "Last Name",
		sort: true,
	}];

	const formComponents = (rowForEdit: StringifiedProps<ClassInstructor>, updateState: (id: string, value: string | boolean) => void) => <React.Fragment>
		<Form.Group>
			<Form.Label sm={2} className="text-sm-right">
				ID
			</Form.Label>
			<Col sm={10} >
				<div style={{textAlign: "left", padding: "5px 14px"}}>
					{rowForEdit.INSTRUCTOR_ID || "(none)"}
				</div>
			</Col>
		</Form.Group>
		<Form.Group>
			<Form.Label sm={2} className="text-sm-right">
				First Name
			</Form.Label>
			<Col sm={10}>
				<Form.Control
					type="text"
					name="nameFirst"
					placeholder="First Name"
					value={rowForEdit.NAME_FIRST}
					onChange={event => updateState("NAME_FIRST", event.target.value)}
				/>
			</Col>
		</Form.Group>
		<Form.Group>
			<Form.Label sm={2} className="text-sm-right">
				Last Name
			</Form.Label>
			<Col sm={10}>
				<Form.Control
					type="text"
					name="nameLast"
					placeholder="Last Name"
					id="nameLast"
					value={rowForEdit.NAME_LAST}
					onChange={event => updateState("NAME_LAST", event.target.value)}
				/>
			</Col>
		</Form.Group>
	</React.Fragment>;

	return <ReportWithModalForm
		rowValidator={classInstructorValidator}
		rows={props.instructors}
		formatRowForDisplay={x => x}
		primaryKey="INSTRUCTOR_ID"
		columns={columns}
		formComponents={formComponents}
		submitRow={putInstructor}
	/>;
}
