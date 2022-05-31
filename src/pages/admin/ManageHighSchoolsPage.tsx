import * as React from "react";
import * as t from "io-ts";
import { FormGroup, Label, Col, Input, CustomInput } from "reactstrap";
import { Check as CheckIcon } from "react-feather";

// Table building utilities
import { tableColWidth } from "util/tableUtil";
import { StringifiedProps } from "util/StringifyObjectProps";

// Validator and putter for the data type of this page
import { highSchoolValidator } from "async/rest/high-schools";
import { putWrapper as putHighSchool } from "async/rest/high-schools";

// The common display structure which is a table editable via modal
import ReportWithModalForm from "components/ReportWithModalForm";
import { SimpleReportColumn } from "core/SimpleReport";

type HighSchool = t.TypeOf<typeof highSchoolValidator>;
// class FormCheckbox extends FormElementCheckbox<FormData> {}

export default function ManageHighSchoolsPage(props: {
	highSchools: HighSchool[];
}) {
	// Define table columns
	const columns: SimpleReportColumn[] = [
		{
			accessor: "edit",
			Header: "",
			disableSortBy: true,
			width: 50,
		},
		{
			accessor: "SCHOOL_ID",
			Header: "ID",
			width: 80,
		},
		{
			accessor: "SCHOOL_NAME",
			Header: "School Name",
		},
		{
			accessor: "ACTIVE",
			Header: "Active",
			width: 100,
		},
	];

	// Define edit/add form
	const formComponents = (
		rowForEdit: StringifiedProps<HighSchool>,
		updateState: (id: string, value: string | boolean) => void
	) => (
		<React.Fragment>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					ID
				</Label>
				<Col sm={9}>
					<div style={{ padding: "5px" }} className="text-left">
						{rowForEdit.SCHOOL_ID || "(none)"}
					</div>
				</Col>
			</FormGroup>
			<FormGroup row className="align-items-center">
				<Label sm={3} className="text-sm-right">
					School Name
				</Label>
				<Col sm={9}>
					<Input
						type="text"
						name="highSchoolName"
						placeholder="School Name"
						value={rowForEdit.SCHOOL_NAME}
						onChange={(event) => updateState("SCHOOL_NAME", event.target.value)}
					/>
				</Col>
			</FormGroup>
			<FormGroup row className="align-items-center">
				<Label sm={3} className="text-sm-right">
					Active
				</Label>
				<Col sm={9}>
					<CustomInput
						type="checkbox"
						id="highSchoolActive"
						checked={rowForEdit.ACTIVE == "Y"}
						className="text-left"
						onChange={(event) => updateState("ACTIVE", event.target.checked)}
					/>
				</Col>
			</FormGroup>
		</React.Fragment>
	);

	return (
		<ReportWithModalForm
			rowValidator={highSchoolValidator}
			rows={props.highSchools}
			formatRowForDisplay={(hs) => ({
				...hs,
				ACTIVE: hs.ACTIVE ? <CheckIcon color="#777" size="1.4em" /> : null,
			})}
			primaryKey="SCHOOL_ID"
			columns={columns}
			formComponents={formComponents}
			submitRow={putHighSchool}
			cardTitle="Manage High Schools"
		/>
	);
}
