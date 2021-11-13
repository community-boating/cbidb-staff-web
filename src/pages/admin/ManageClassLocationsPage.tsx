import * as React from "react";
import * as t from "io-ts";
import { FormGroup, Label, Col, Input, CustomInput } from "reactstrap";
import { ColumnDescription } from "react-bootstrap-table-next";
import { Check as CheckIcon } from "react-feather";

// Table building utilities
import { tableColWidth } from "@util/tableUtil";
import { OptionifiedProps } from "@util/OptionifyObjectProps";

// Validator and putter for the data type of this page
import { classLocationValidator } from "@async/rest/class-locations";
import { putWrapper as putClassLocation } from "@async/rest/class-locations";

// The common display structure which is a table editable via modal
import ReportWithModalForm from "@components/ReportWithModalForm";

type ClassLocation = t.TypeOf<typeof classLocationValidator>;

export default function ManageClassLocationsPage(props: {
	locations: ClassLocation[];
}) {
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
			text: "Name",
			sort: true,
		},
		{
			dataField: "ACTIVE",
			text: "Active",
			sort: true,
			formatter: (value: boolean, _row) => {
				return value ? <CheckIcon color="#777" size="1.4em" /> : null;
			},
			...tableColWidth(100),
		},
	];

	// Define edit/add form
	const formComponents = (
		rowForEdit: OptionifiedProps<ClassLocation>,
		updateState: (id: string, value: string | boolean) => void
	) => (
		<React.Fragment>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					ID
				</Label>
				<Col sm={9}>
					<div style={{ padding: "5px" }} className="text-left">
						{rowForEdit.LOCATION_ID.map(String).getOrElse("(none)")}
					</div>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Location Name
				</Label>
				<Col sm={9}>
					<Input
						type="text"
						name="tagName"
						placeholder="ClassLocation Name"
						value={rowForEdit.LOCATION_NAME.getOrElse("")}
						onChange={(event) =>
							updateState("LOCATION_NAME", event.target.value)
						}
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
						id="isActive"
						checked={rowForEdit.ACTIVE.getOrElse(false)}
						className="text-left"
						onChange={(event) => updateState("ACTIVE", event.target.checked)}
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
