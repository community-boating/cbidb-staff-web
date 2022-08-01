import * as React from "react";
import * as t from "io-ts";
import { FormGroup, Label, Col, Input, CustomInput } from "reactstrap";
import { Check as CheckIcon } from "react-feather";

// Table building utilities
import { CellBooleanIcon, CellOption, getEditColumn, SortTypeBoolean, SortTypeOptionalNumber, tableColWidth } from "util/tableUtil";

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
	const columns: TableColumnOptionsCbi<DonationFund>[] = [
			getEditColumn(50),
		{
			accessorKey: "FUND_ID",
			header: "ID",
			size: 80,
		},
		{
			accessorKey: "FUND_NAME",
			header: "Fund Name",
		},
		{
			accessorKey: "LETTER_TEXT",
			header: "Letter Text",
			cell: CellOption,
		},
		{
			accessorKey: "ACTIVE",
			header: "Active",
			size: 100,
			cell: CellBooleanIcon(<CheckIcon color="#777" size="1.4em" />),
			sortingFn: SortTypeBoolean
		},
		{
			accessorKey: "DISPLAY_ORDER",
			header: "Display Order",
			size: 130,
			cell: CellOption,
			sortingFn: SortTypeOptionalNumber
		},
		{
			accessorKey: "SHOW_IN_CHECKOUT",
			header: "Show in Checkout",
			size: 125,
			cell: CellBooleanIcon(<CheckIcon color="#777" size="1.4em" />),
			sortingFn: SortTypeBoolean
		},
		{
			accessorKey: "PORTAL_DESCRIPTION",
			header: "Portal Description",
			cell: CellOption,
		},
		{
			accessorKey: "IS_ENDOWMENT",
			header: "Is Endowment",
			size: 125,
			cell: CellBooleanIcon(<CheckIcon color="#777" size="1.4em" />),
			sortingFn: SortTypeBoolean
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
			primaryKey="FUND_ID"
			columns={columns}
			formComponents={formComponents}
			submitRow={putDonationFund}
			cardTitle="Manage Donation Funds"
			initialSortBy={[{id: "DISPLAY_ORDER", desc: false}]}
		/>
	);
}
