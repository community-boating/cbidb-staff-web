import * as React from "react";
import * as t from "io-ts";
import { validator as personValidator } from "async/rest/person/get-person";

import PersonSummaryCard from "./PersonSummaryCard";
import { Col, FormGroup, Input, Row, Table } from "reactstrap";

import * as moment from 'moment';
import { DATE_FORMAT_LOCAL_DATE } from "util/dateUtil";

interface Props {
	person: t.TypeOf<typeof personValidator>;
}

interface RowDescription {
	key: string;
	value: React.ReactNode;
}

export default function GeneralSummaryCard(props: Props) {
	const { person } = props;

	const personCell: RowDescription[] = [{
		key: "Member ID",
		value: String(person.personId),
	}, {
		key: "Name",
		value: `${person.nameFirst.getOrElse("")} ${person.nameLast.getOrElse("")}`,
	}, {
		key: "DOB",
		value: person.dob.map(dob => moment(dob, DATE_FORMAT_LOCAL_DATE).format("MM/DD/YYYY")).getOrElse(""),
	}, {
		key: "Phone Number",
		value: person.phonePrimary.getOrElse(""),
	}, {
		key: "Email",
		value: person.email.getOrElse(""),
	}];

	const emerg1Cell: RowDescription[] = [{
		key: "Emergency Contact 1",
		value: person.emerg1Name.getOrElse(""),
	}, {
		key: "EC1 Relation",
		value: person.emerg1Relation.getOrElse(""),
	}, {
		key: "EC1 Primary Phone",
		value: person.emerg1PhonePrimary.getOrElse(""),
	}, {
		key: "EC1 Alternate Phone",
		value: person.emerg1PhoneAlternate.getOrElse(""),
	}]

	const emerg2Cell: RowDescription[] = [{
		key: "Emergency Contact 2",
		value: person.emerg2Name.getOrElse(""),
	}, {
		key: "EC2 Relation",
		value: person.emerg2Relation.getOrElse(""),
	}, {
		key: "EC2 Primary Phone",
		value: person.emerg2PhonePrimary.getOrElse(""),
	}, {
		key: "EC2 Alternate Phone",
		value: person.emerg2PhoneAlternate.getOrElse(""),
	}]

	function renderCell(cell: RowDescription[]) {
		return <Table borderless className="m-0">
			<tbody>
				{cell.map((row) => {
					return (
						<tr key={row.key.replace(" ", "_")}>
							<th className="text-right">{row.key}</th>
							<td>{row.value}</td>
						</tr>
					);
				})}
			</tbody>
		</Table>;
	}

	const body = () => {
		return (
			<Row>
				<Col>
					{renderCell(personCell)}
				</Col>
				<Col>
					{renderCell(emerg1Cell)}
				</Col>
				<Col>
					{renderCell(emerg2Cell)}
				</Col>
			</Row>
		);
	};

	return <PersonSummaryCard title="Details" body={body} person={person} />;
}
