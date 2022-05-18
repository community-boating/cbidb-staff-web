import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap';
import { SubmitAction } from '.';

type Staff = {
	name: string,
	in: string,
	out: string
}

type Props = {
	openModal: (content: JSX.Element) => void,
	setSubmitAction: (submit: SubmitAction) => void
}

const dockmasters: Staff[] = [{
	name: "Charlie Zechel",
	in: "09:00AM",
	out: "01:00PM"
}, {
	name: "Andrew Alletag",
	in: "01:00PM",
	out: "08:00PM"
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

const StaffTable = (props: Props & {title: string, staff: Staff[]}) => <Card>
	<CardHeader style={{borderBottom: "none", paddingBottom: 0}}>
		<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
			<>hi</>
		)} />
		<CardTitle tag="h2" className="mb-0">{props.title}</CardTitle>
	</CardHeader>
	<CardBody>
		<Table size="sm">
			<tbody>
				<tr>
					<th>Name</th>
					<th style={{width: "75px"}}>In</th>
					<th style={{width: "75px"}}>Out</th>
				</tr>
				{props.staff.map((e, i) => {
					return <tr key={`row_${i}`}>
						<td>{e.name}</td>
						<td>{e.in}</td>
						<td>{e.out}</td>
					</tr>
				})}
			</tbody>
		</Table>
	</CardBody>
</Card>;

export const Dockmasters = (props: Props) => <StaffTable {...props} title="Dockmaster" staff={dockmasters} />

export const Staff = (props: Props) => <StaffTable {...props} title="Staff" staff={staff} />
