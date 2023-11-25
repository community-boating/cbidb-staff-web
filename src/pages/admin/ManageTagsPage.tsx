import * as React from "react";
import * as t from "io-ts";
import { FormGroup, Label, Col, Input } from "reactstrap";

// Validator and putter for the data type of this page
import { tagValidator } from "async/rest/tags";
import { putWrapper as putTag } from "async/rest/tags";

// The common display structure which is a table editable via modal
import ReportWithModalForm from "components/ReportWithModalForm";
import { StringifiedProps } from "util/StringifyObjectProps";
import { ColumnDef } from "@tanstack/react-table";

type Tag = t.TypeOf<typeof tagValidator>;

export default function ManageTagsPage(props: { tags: Tag[] }) {
	// Define table columns
	const columns: ColumnDef<Tag>[] = [
		{
			accessorKey: "tagId",
			header: "ID",
			size: 75,
		},
		{
			accessorKey: "tagName",
			header: "Tag Name",
			size: null
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
						{rowForEdit.tagId || "(none)"}
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
						value={rowForEdit.tagName}
						onChange={(event) => updateState("tagName", event.target.value)}
					/>
				</Col>
			</FormGroup>
		</React.Fragment>
	);

	return (
		<ReportWithModalForm
			rowValidator={tagValidator}
			rows={props.tags}
			primaryKey="tagId"
			columns={columns}
			formComponents={formComponents}
			submitRow={putTag}
			cardTitle="Manage Tags"
		/>
	);
}
