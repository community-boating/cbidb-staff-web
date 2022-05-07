import * as React from 'react';
import { Card, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap';

type Staff = {
	name: string,
	in: string,
	out: string
}

const dockmasters: Staff[] = [{
	name: "Charlie Zechel",
	in: "09:00AM",
	out: "01:00PM"
}, {
	name: "Andrew Alletag",
	in: "01:00PM",
	out: "08:00PM"
}]

const staff: Staff[] = [{
	name: "Evan McCarty",
	in: "09:00AM",
	out: "08:00PM"
}, {
	name: "Evan McCarty",
	in: "09:00AM",
	out: "08:00PM"
}, {
	name: "Evan McCarty",
	in: "09:00AM",
	out: "08:00PM"
}, {
	name: "Evan McCarty",
	in: "09:00AM",
	out: "08:00PM"
}, {
	name: "Evan McCarty",
	in: "09:00AM",
	out: "08:00PM"
}]

const drawTable = (title: string, staff: Staff[]) => <Col md="12"><Card>
	<CardHeader>
		<CardTitle><h4>{title}</h4></CardTitle>
		<Table size="sm">
			<tbody>
				<tr>
					<th>Name</th>
					<th style={{width: "75px"}}>In</th>
					<th style={{width: "75px"}}>Out</th>
				</tr>
				{staff.map(e => {
					return <tr>
						<td>{e.name}</td>
						<td>{e.in}</td>
						<td>{e.out}</td>
					</tr>
				})}
			</tbody>
		</Table>
	</CardHeader>
</Card></Col>

export default () => <><Row>
	{drawTable("Dockmasters", dockmasters)}
</Row><Row>
	{drawTable("Staff", staff)}
</Row></>
