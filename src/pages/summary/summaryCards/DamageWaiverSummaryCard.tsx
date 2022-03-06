import * as React from "react";
import * as t from "io-ts";

import { validator as personValidator } from "@async/rest/person/get-person";
import {
	damageWaiverValidator,
	getWrapper,
	putWrapper,
} from "@async/rest/person/get-damage-waiver";
import PersonSummaryCard from "./PersonSummaryCard";
import { Col, FormGroup, Label } from "reactstrap";
import { StringifiedProps } from "@util/StringifyObjectProps";
import ReportWithModalForm from "@components/ReportWithModalForm";
import { tableColWidth } from "@util/tableUtil";
import { ColumnDescription } from "react-bootstrap-table-next";

type Person = t.TypeOf<typeof personValidator>;
type PersonDamageWaiver = t.TypeOf<typeof damageWaiverValidator>;

interface Props {
	person: Person;
}

export default function DamageWaiverSummaryCard(props: Props) {
	const { person } = props;

	const body = (data: PersonDamageWaiver[]) => {
		const columns: ColumnDescription[] = [
			{
				dataField: "edit",
				text: "",
				...tableColWidth(50),
			},
			{ dataField: "WAIVER_ID", text: "Price" },
			{ dataField: "pdate", isDummyField: true, text: "Purchase Date" },
			{ dataField: "sdate", isDummyField: true, text: "Start Date" },
			{ dataField: "edate", isDummyField: true, text: "Expiration Date" },
			{ dataField: "void", isDummyField: true, text: "Void?" },
		];

		const formComponents = (
			rowForEdit: StringifiedProps<PersonDamageWaiver>,
			updateState: (id: string, value: string | boolean) => void
		) => (
			<React.Fragment>
				<FormGroup row>
					<Label sm={2} className="text-sm-right">
						ID
					</Label>
					<Col sm={10}>
						<div style={{ textAlign: "left", padding: "5px 14px" }}>
							{rowForEdit.WAIVER_ID || "(none)"}
						</div>
					</Col>
				</FormGroup>
			</React.Fragment>
		);

		return (
			<ReportWithModalForm
				rowValidator={damageWaiverValidator}
				rows={data}
				formatRowForDisplay={(x) => x}
				primaryKey="WAIVER_ID"
				columns={columns}
				formComponents={formComponents}
				submitRow={putWrapper}
				cardTitle="Damage Waivers"
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
		);
	};

	return (
		<PersonSummaryCard<PersonDamageWaiver[]>
			title="Damage Waivers"
			body={body}
			person={person}
			getAsyncProps={() => getWrapper(person.PERSON_ID).send(null)}
			replaceParent
		/>
	);
}
