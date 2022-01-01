import * as React from "react";
import * as t from "io-ts";
import { Col, Form } from "react-bootstrap";
import { ColumnDescription } from "react-bootstrap-table-next";

// Table building utilities
import { tableColWidth } from "@util/tableUtil";

// Validator and putter for the data type of this page
import { tagValidator } from "@async/rest/tags";
import { putWrapper as putTag } from "@async/rest/tags";

// The common display structure which is a table editable via modal
import ReportWithModalForm from "@components/ReportWithModalForm";
import { StringifiedProps } from "@util/StringifyObjectProps";

type Tag = t.TypeOf<typeof tagValidator>;

export default function ManageTagsPage(props: { tags: Tag[] }) {
	// Define table columns
	const columns: ColumnDescription[] = [
		{
			dataField: "edit",
			text: "",
			...tableColWidth(50),
		},
		{
			dataField: "TAG_ID",
			text: "ID",
			sort: true,
			...tableColWidth(80),
		},
		{
			dataField: "TAG_NAME",
			text: "Tag Name",
			sort: true,
		},
	];

	// Define edit/add form
	const formComponents = (
		rowForEdit: StringifiedProps<Tag>,
		updateState: (id: string, value: string | boolean) => void
	) => (
		<React.Fragment>
			<Form.Group>
				<Form.Label sm={2} className="text-sm-right">
					ID
				</Form.Label>
				<Col sm={10}>
					<div style={{ textAlign: "left", padding: "5px 14px" }}>
						{rowForEdit.TAG_ID || "(none)"}
					</div>
				</Col>
			</Form.Group>
			<Form.Group>
				<Form.Label sm={2} className="text-sm-right">
					Tag Name
				</Form.Label>
				<Col sm={10}>
					<Form.Control
						type="text"
						name="tagName"
						placeholder="Tag Name"
						value={rowForEdit.TAG_NAME}
						onChange={(event) => updateState("TAG_NAME", event.target.value)}
					/>
				</Col>
			</Form.Group>
		</React.Fragment>
	);

	return (
		<ReportWithModalForm
			rowValidator={tagValidator}
			rows={props.tags}
			formatRowForDisplay={x => x}
			primaryKey="TAG_ID"
			columns={columns}
			formComponents={formComponents}
			submitRow={putTag}
			cardTitle="Tags"
		/>
	);
}
