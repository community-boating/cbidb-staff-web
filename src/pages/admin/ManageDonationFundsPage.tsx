import * as React from "react";
import * as t from "io-ts";
import { FormGroup, Label, Col, Input, CustomInput } from "reactstrap";
import { Check as CheckIcon } from "react-feather";

// Table building utilities
import { CellBooleanIcon, CellOption, SortTypeBoolean, SortTypeOptionalNumber, tableColWidth } from "util/tableUtil";

// Validator and putter for the data type of this page
import { donationFundValidator } from "async/rest/donation-funds";
import { putWrapper as putDonationFund } from "async/rest/donation-funds";

// The common display structure which is a table editable via modal
import ReportWithModalForm from "components/ReportWithModalForm";
import { StringifiedProps } from "util/StringifyObjectProps";
import { Column } from "react-table";
import { TableColumnOptionsCbi } from "react-table-config";

type DonationFund = t.TypeOf<typeof donationFundValidator>;

export default function ManageDonationFundsPage(props: {
	donationFunds: DonationFund[];
}) {
	// Define table columns
	const columns: TableColumnOptionsCbi[] = [
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
			Cell: CellOption,
		},
		{
			accessor: "ACTIVE",
			Header: "Active",
			width: 100,
			Cell: CellBooleanIcon(<CheckIcon color="#777" size="1.4em" />),
			sortType: SortTypeBoolean
		},
		{
			accessor: "DISPLAY_ORDER",
			Header: "Display Order",
			width: 130,
			Cell: CellOption,
			sortType: SortTypeOptionalNumber
		},
		{
			accessor: "SHOW_IN_CHECKOUT",
			Header: "Show in Checkout",
			width: 125,
			Cell: CellBooleanIcon(<CheckIcon color="#777" size="1.4em" />),
			sortType: SortTypeBoolean
		},
		{
			accessor: "PORTAL_DESCRIPTION",
			Header: "Portal Description",
			Cell: CellOption,
		},
		{
			accessor: "IS_ENDOWMENT",
			Header: "Is Endowment",
			width: 125,
			Cell: CellBooleanIcon(<CheckIcon color="#777" size="1.4em" />),
			sortType: SortTypeBoolean
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
			rows={props.donationFunds.map(f => ({ ...f, FUND_ID: f.FUND_ID.getOrElse(null)}))}
			primaryKey="FUND_ID"
			columns={columns}
			formComponents={formComponents}
			submitRow={putDonationFund}
			cardTitle="Manage Donation Funds"
			initialSortBy={[{id: "DISPLAY_ORDER"}]}
		/>
	);
}
