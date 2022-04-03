import * as React from "react";
import * as t from "io-ts";
import { FormGroup, Label, Col, Input, CustomInput } from "reactstrap";
import { ColumnDescription } from "react-bootstrap-table-next";
import { Check as CheckIcon } from "react-feather";

// Table building utilities
import { tableColWidth } from "@util/tableUtil";

// Validator and putter for the data type of this page
import { donationFundValidator } from "@async/rest/donation-funds";
import { putWrapper as putDonationFund } from "@async/rest/donation-funds";

// The common display structure which is a table editable via modal
import ReportWithModalForm from "@components/ReportWithModalForm";
import { StringifiedProps } from "@util/StringifyObjectProps";
import { SimpleReportColumn } from "@core/SimpleReport";

type DonationFund = t.TypeOf<typeof donationFundValidator>;

export default function ManageDonationFundsPage(props: {
	donationFunds: DonationFund[];
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
			accessor: "FUND_ID",
			Header: "ID",
			width: 80,
		},
		{
			accessor: "FUND_NAME",
			Header: "Fund Name",
		},
		{
			accessor: "LETTER_TEXT",
			Header: "Letter Text",
		},
		{
			accessor: "ACTIVE",
			Header: "Active",
			width: 100,
		},
		{
			accessor: "DISPLAY_ORDER",
			Header: "Display Order",
			width: 130,
		},
		{
			accessor: "SHOW_IN_CHECKOUT",
			Header: "Show in Checkout",
			width: 125,
		},
		{
			accessor: "PORTAL_DESCRIPTION",
			Header: "Portal Description",
		},
		{
			accessor: "IS_ENDOWMENT",
			Header: "Is Endowment",
			width: 125,
		},
	];

	// Define edit/add form
	const formComponents = (
		rowForEdit: StringifiedProps<DonationFund>,
		updateState: (id: string, value: string | boolean) => void
	) => (
		<React.Fragment>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					ID
				</Label>
				<Col sm={9}>
					<div style={{ padding: "5px" }} className="text-left">
						{rowForEdit.FUND_ID || "(none)"}
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
						value={rowForEdit.FUND_NAME}
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
						value={rowForEdit.LETTER_TEXT}
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
						checked={rowForEdit.ACTIVE == "Y"}
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
						value={rowForEdit.DISPLAY_ORDER}
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
						checked={rowForEdit.SHOW_IN_CHECKOUT == "Y"}
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
						value={rowForEdit.PORTAL_DESCRIPTION}
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
						checked={rowForEdit.IS_ENDOWMENT == "Y"}
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
			formatRowForDisplay={fund => ({
				...fund,
				LETTER_TEXT: fund.LETTER_TEXT.getOrElse(""),
				DISPLAY_ORDER: fund.DISPLAY_ORDER.map(String).getOrElse(""),
				PORTAL_DESCRIPTION: fund.PORTAL_DESCRIPTION.getOrElse(""),
				ACTIVE: fund.ACTIVE ? <CheckIcon color="#777" size="1.4em" /> : null,
				SHOW_IN_CHECKOUT: fund.SHOW_IN_CHECKOUT ? <CheckIcon color="#777" size="1.4em" /> : null,
				IS_ENDOWMENT: fund.IS_ENDOWMENT ? <CheckIcon color="#777" size="1.4em" /> : null,
			})}
			primaryKey="FUND_ID"
			columns={columns}
			formComponents={formComponents}
			submitRow={putDonationFund}
			cardTitle="Manage Donation Funds"
		/>
	);
}
