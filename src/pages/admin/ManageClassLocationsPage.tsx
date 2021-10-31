import * as React from "react";
import * as t from "io-ts";
import { FormGroup, Label, Col, Input } from "reactstrap";
import { ColumnDescription } from "react-bootstrap-table-next";

// Table building utilities
import { tableColWidth } from "@util/tableUtil";
import { OptionifiedProps } from "@util/OptionifyObjectProps";

// Validator and putter for the data type of this page
import { classLocationValidator } from "@async/rest/class-locations";
import { putWrapper as putClassLocation } from "@async/rest/class-locations";

// The common display structure which is a table editable via modal
import ReportWithModalForm from "@components/ReportWithModalForm";

type ClassLocation = t.TypeOf<typeof classLocationValidator>;

export default function ManageClassLocationsPage(props: { locations: ClassLocation[] }) {
	// Define table columns
	const columns: ColumnDescription[] = [
		{
			dataField: "edit",
			text: "",
			...tableColWidth(50),
		},
		{
			dataField: "LOCATION_ID",
			text: "ID",
			sort: true,
			...tableColWidth(80),
		},
		{
			dataField: "LOCATION_NAME",
			text: "ClassLocation Name",
			sort: true,
		},
	];

	// Define edit/add form
	const formComponents = (
		rowForEdit: OptionifiedProps<ClassLocation>,
		updateState: (id: string, value: string) => void
	) => (
		<React.Fragment>
			<FormGroup row>
				<Label sm={2} className="text-sm-right">
					ID
				</Label>
				<Col sm={10}>
					<div style={{ textAlign: "left", padding: "5px 14px" }}>
						{rowForEdit.LOCATION_ID.map(String).getOrElse("(none)")}
					</div>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={2} className="text-sm-right">
					Class Location Name
				</Label>
				<Col sm={10}>
					<Input
						type="text"
						name="tagName"
						placeholder="ClassLocation Name"
						value={rowForEdit.LOCATION_NAME.getOrElse("")}
						onChange={(event) => updateState("LOCATION_NAME", event.target.value)}
					/>
				</Col>
			</FormGroup>
		</React.Fragment>
	);

	return (
		<ReportWithModalForm
			rowValidator={classLocationValidator}
			rows={props.locations}
			primaryKey="LOCATION_ID"
			columns={columns}
			formComponents={formComponents}
			submitRow={putClassLocation}
			cardTitle="Class Locations"
		/>
	);
}
