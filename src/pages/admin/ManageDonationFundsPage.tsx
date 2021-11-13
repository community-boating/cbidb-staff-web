import * as React from "react";
import * as t from "io-ts";
import { FormGroup, Label, Col, Input, CustomInput } from "reactstrap";
import { ColumnDescription } from "react-bootstrap-table-next";
import { Check as CheckIcon } from "react-feather";

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
	donationFunds: DonationFund[];
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
		{
			dataField: "LETTER_TEXT",
			text: "Letter Text",
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
		{
			dataField: "DISPLAY_ORDER",
			text: "Display Order",
			sort: true,
			...tableColWidth(130),
		},
		{
			dataField: "SHOW_IN_CHECKOUT",
			text: "Show in Checkout",
			sort: true,
			formatter: (value: boolean, _row) => {
				return value ? <CheckIcon color="#777" size="1.4em" /> : null;
			},
			...tableColWidth(125),
		},
		{
			dataField: "PORTAL_DESCRIPTION",
			text: "Portal Description",
			sort: true,
		},
		{
			dataField: "IS_ENDOWMENT",
			text: "Is Endowment",
			sort: true,
			formatter: (value: boolean, _row) => {
				return value ? <CheckIcon color="#777" size="1.4em" /> : null;
			},
			...tableColWidth(125),
		},
	];

	// Define edit/add form
	const formComponents = (
		rowForEdit: OptionifiedProps<DonationFund>,
		updateState: (id: string, value: string | boolean) => void
	) => (
		<React.Fragment>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					ID
				</Label>
				<Col sm={9}>
					<div style={{ padding: "5px" }} className="text-left">
						{rowForEdit.FUND_ID.map(String).getOrElse("(none)")}
					</div>
				</Col>
			</FormGroup>

			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Fund Name
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

			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Letter Text
				</Label>
				<Col sm={9}>
					<Input
						type="textarea"
						name="letterText"
						placeholder=""
						value={rowForEdit.LETTER_TEXT.getOrElse("")}
						onChange={(event) => updateState("LETTER_TEXT", event.target.value)}
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

			<FormGroup row className="align-items-center">
				<Label sm={3} className="text-sm-right">
					Display Order
				</Label>
				<Col sm={9}>
					<Input
						type="number"
						name="displayOrder"
						placeholder="0"
						value={rowForEdit.DISPLAY_ORDER.getOrElse(0)}
						onChange={(event) =>
							updateState("DISPLAY_ORDER", event.target.value)
						}
					/>
				</Col>
			</FormGroup>

			<FormGroup row className="align-items-center">
				<Label sm={3} className="text-sm-right">
					Show in Checkout
				</Label>
				<Col sm={9}>
					<CustomInput
						type="checkbox"
						id="showInCheckout"
						checked={rowForEdit.SHOW_IN_CHECKOUT.getOrElse(false)}
						className="text-left"
						onChange={(event) =>
							updateState("SHOW_IN_CHECKOUT", event.target.checked)
						}
					/>
				</Col>
			</FormGroup>

			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Portal Description
				</Label>
				<Col sm={9}>
					<Input
						type="textarea"
						name="portalDescription"
						placeholder=""
						value={rowForEdit.PORTAL_DESCRIPTION.getOrElse("")}
						onChange={(event) => updateState("PORTAL_DESCRIPTION", event.target.value)}
					/>
				</Col>
			</FormGroup>

			<FormGroup row className="align-items-center">
				<Label sm={3} className="text-sm-right">
					Is Endowment
				</Label>
				<Col sm={9}>
					<CustomInput
						type="checkbox"
						id="isEndowment"
						checked={rowForEdit.IS_ENDOWMENT.getOrElse(false)}
						className="text-left"
						onChange={(event) =>
							updateState("IS_ENDOWMENT", event.target.checked)
						}
					/>
				</Col>
			</FormGroup>
		</React.Fragment>
	);

	return (
		<ReportWithModalForm
			rowValidator={donationFundValidator}
			rows={props.donationFunds}
			primaryKey="FUND_ID"
			columns={columns}
			formComponents={formComponents}
			submitRow={putDonationFund}
			cardTitle="Donation Funds"
		/>
	);
}