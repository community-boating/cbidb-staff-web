import * as React from "react";
import * as t from "io-ts";
import { FormGroup, Label, Col, Input } from "reactstrap";

// Table building utilities
import { tableColWidth } from "util/tableUtil";

// Validator and putter for the data type of this page
import { tagValidator } from "async/rest/tags";
import { putWrapper as putTag } from "async/rest/tags";

// The common display structure which is a table editable via modal
import ReportWithModalForm from "components/ReportWithModalForm";
import { StringifiedProps } from "util/StringifyObjectProps";
import { Column } from "react-table";
import { TableColumnOptionsCbi } from "react-table-config";

type Tag = t.TypeOf<typeof tagValidator>;

export default function ManageTagsPage(props: { tags: Tag[] }) {
	// Define table columns
	const columns: TableColumnOptionsCbi[] = [
		{
			accessor: "edit",
			Header: "",
			disableSortBy: true,
			width: 50,
		},
		{
			accessor: "TAG_ID",
			Header: "ID",
			width: 75,
		},
		{
			accessor: "TAG_NAME",
			Header: "Tag Name",
			width: null
		},
	];

	// Define edit/add form
	const formComponents = (
		rowForEdit: StringifiedProps<Tag>,
		updateState: (id: string, value: string | boolean) => void
	) => (
		<React.Fragment>
			<FormGroup row>
				<Label sm={2} className="text-sm-right">
					ID
				</Label>
				<Col sm={10}>
					<div style={{ textAlign: "left", padding: "5px 14px" }}>
						{rowForEdit.TAG_ID || "(none)"}
					</div>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={2} className="text-sm-right">
					Tag Name
				</Label>
				<Col sm={10}>
					<Input
						type="text"
						name="tagName"
						placeholder="Tag Name"
						value={rowForEdit.TAG_NAME}
						onChange={(event) => updateState("TAG_NAME", event.target.value)}
					/>
				</Col>
			</FormGroup>
		</React.Fragment>
	);

	return (
		<ReportWithModalForm
			rowValidator={tagValidator}
			rows={props.tags.map(t => ({ ...t, TAG_ID: t.TAG_ID.getOrElse(null)}))}
			primaryKey="TAG_ID"
			columns={columns}
			formComponents={formComponents}
			submitRow={putTag}
			cardTitle="Manage Tags"
		/>
	);
}
