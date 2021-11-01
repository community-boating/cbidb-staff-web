import * as React from "react";
import * as t from "io-ts";
import { FormGroup, Label, Col, Input } from "reactstrap";
import { ColumnDescription } from "react-bootstrap-table-next";

// Table building utilities
import { tableColWidth } from "@util/tableUtil";
import { OptionifiedProps } from "@util/OptionifyObjectProps";

// Validator and putter for the data type of this page
import { donationFundValidator } from "@async/rest/donation-funds";
import { putWrapper as putDonationFund } from "@async/rest/donation-funds";

// The common display structure which is a table editable via modal
import ReportWithModalForm from "@components/ReportWithModalForm";

type DonationFund = t.TypeOf<typeof donationFundValidator>;

export default function ManageDonationFundsPage(props: {
	donations: DonationFund[];
}) {
	// Define table columns
	const columns: ColumnDescription[] = [
		{
			dataField: "edit",
			text: "",
			...tableColWidth(50),
		},
		{
			dataField: "FUND_ID",
			text: "ID",
			sort: true,
			...tableColWidth(80),
		},
		{
			dataField: "FUND_NAME",
			text: "Fund Name",
			sort: true,
		},
	];

	// Define edit/add form
	const formComponents = (
		rowForEdit: OptionifiedProps<DonationFund>,
		updateState: (id: string, value: string) => void
	) => (
		<React.Fragment>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					ID
				</Label>
				<Col sm={9}>
					<div style={{ textAlign: "left", padding: "5px 14px" }}>
						{rowForEdit.FUND_ID.map(String).getOrElse("(none)")}
					</div>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					First Name
				</Label>
				<Col sm={9}>
					<Input
						type="text"
						name="fundName"
						placeholder="Fund Name"
						value={rowForEdit.FUND_NAME.getOrElse("")}
						onChange={(event) => updateState("FUND_NAME", event.target.value)}
					/>
				</Col>
			</FormGroup>
		</React.Fragment>
	);

	return (
		<ReportWithModalForm
			rowValidator={donationFundValidator}
			rows={props.donations}
			primaryKey="FUND_ID"
			columns={columns}
			formComponents={formComponents}
			submitRow={putDonationFund}
			cardTitle="Donation Funds"
		/>
	);
}
