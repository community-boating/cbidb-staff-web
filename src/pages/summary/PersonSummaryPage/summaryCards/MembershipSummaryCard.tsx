import * as React from "react";
import * as t from "io-ts";

import { validator as personValidator } from "async/rest/person/get-person";
import {
	membershipValidator,
	getWrapper,
	putWrapper,
} from "async/rest/person/get-person-memberships";
import PersonSummaryCard from "./PersonSummaryCard";
import { Col, FormGroup, Label } from "reactstrap";
import { StringifiedProps } from "util/StringifyObjectProps";
import ReportWithModalForm from "components/ReportWithModalForm";
import { tableColWidth } from "util/tableUtil";

type Person = t.TypeOf<typeof personValidator>;
type PersonMembership = t.TypeOf<typeof membershipValidator>;

interface Props {
	person: Person;
}

export default function MembershipSummaryCard(props: Props) {
	const { person } = props;

	const body = (data: PersonMembership[]) => {
		/*const columns: ColumnDescription[] = [
			{
				dataField: "edit",
				text: "",
				...tableColWidth(50),
			},
			{ dataField: "ASSIGN_ID", text: "Membership Type" },
			{ dataField: "void", isDummyField: true, text: "Void?" },
			{ dataField: "dicount", isDummyField: true, text: "Discount" },
			{ dataField: "price", isDummyField: true, text: "Price" },
			{ dataField: "pdate", isDummyField: true, text: "Purchase Date" },
			{ dataField: "sdate", isDummyField: true, text: "Start Date" },
			{ dataField: "edate", isDummyField: true, text: "Expiration Date" },
			{ dataField: "gprivs", isDummyField: true, text: "Guest Privs?" },
			{ dataField: "discount", isDummyField: true, text: "Discount Frozen" },
		];*/

		const formComponents = (
			rowForEdit: StringifiedProps<PersonMembership>,
			updateState: (id: string, value: string | boolean) => void
		) => (
			<React.Fragment>
				<FormGroup row>
					<Label sm={2} className="text-sm-right">
						ID
					</Label>
					<Col sm={10}>
						<div style={{ textAlign: "left", padding: "5px 14px" }}>
							{rowForEdit.ASSIGN_ID || "(none)"}
						</div>
					</Col>
				</FormGroup>
			</React.Fragment>
		);

		return null /*(
			<ReportWithModalForm
				rowValidator={membershipValidator}
				rows={data}
				formatRowForDisplay={(x) => x}
				primaryKey="ASSIGN_ID"
				columns={columns}
				formComponents={formComponents}
				submitRow={putWrapper}
				cardTitle="Memberships"
				addButtonLocation="header"
				cardClassName="person-summary-card"
				sizePerPage={5}
				sizePerPageList={[
					{ text: "5", value: 5 },
					{ text: "10", value: 10 },
					{ text: "25", value: 25 },
					{ text: "All", value: data.length },
				]}
			/>
		);*/
	};

	return (
		<PersonSummaryCard<PersonMembership[]>
			title="Memberships"
			body={body}
			person={person}
			getAsyncProps={() => getWrapper(person.personId).send()}
			replaceParent={true}
		/>
	);
}
