import * as React from "react";
import * as t from "io-ts";
import { validator as personValidator } from "@async/rest/person/get-person";

import PersonSummaryCard from "./PersonSummaryCard";
import { FormGroup, Input, Table } from "reactstrap";

import EmergencyContact from "./EmergencyContact";

interface Props {
	person: t.TypeOf<typeof personValidator>;
}

interface RowDescription {
	key: string;
	value: React.ReactNode;
}

export default function GeneralSummaryCard(props: Props) {
	const { person } = props;

	const detailsRows: RowDescription[] = [
		{
			key: "Member ID",
			value: String(person.PERSON_ID),
		},
		{
			key: "Name",
			value: `${person.NAME_FIRST} ${person.NAME_LAST}`,
		},
		{
			key: "DOB",
			value: `11/09/1995`,
		},
		{
			key: "Phone Number",
			value: `505-480-0682`,
		},
		{
			key: "Email",
			value: `neil.sparks.95@gmail.com`,
		},
		{
			key: "Emergency Contact 1",
			value: (
				<EmergencyContact
					contact={{
						Name: "Testy",
						Relation: "Friend",
						"Primary Phone": "5054800682",
						"Alternate Phone": "5054800682",
					}}
				/>
			),
		},
		{
			key: "Emergency Contact 2",
			value: <EmergencyContact />,
		},
		{
			key: "UAP Boat",
			value: (
				<FormGroup style={{ marginTop: "-0.25rem" }}>
					<Input id="uap-boat-select" disabled type="select" defaultValue="0">
						<option value="0">Select boat...</option>
					</Input>
				</FormGroup>
			),
		},
	];

	const body = () => {
		return (
			<>
				<Table borderless className="m-0">
					<tbody>
						{detailsRows.map((row) => {
							return (
								<tr key={row.key.replace(" ", "_")}>
									<th className="text-right">{row.key}</th>
									<td>{row.value}</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</>
		);
	};

	return <PersonSummaryCard title="Details" body={body} person={person} />;
}
