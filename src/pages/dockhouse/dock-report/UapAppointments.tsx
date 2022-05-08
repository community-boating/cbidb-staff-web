import * as React from 'react';
import { Card, CardHeader, CardTitle, Table } from 'reactstrap';

const appts = [{
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}]

export default () => <Card>
	<CardHeader>
		<CardTitle><h4>UAP Appointments</h4></CardTitle>
		<Table size="sm">
			<tbody>
				<tr>
					<th style={{width: "75px"}}>Time</th>
					<th style={{width: "95px"}}>Appt Type</th>
					<th>Person</th>
					<th style={{width: "75px"}}>Boat</th>
					<th style={{width: "120px"}}>Instructor</th>
				</tr>
				{appts.map(appt => {
					return <tr>
					<td>{appt.time}</td>
					<td>{appt.apptType}</td>
					<td>{appt.person}</td>
					<td>{appt.boat}</td>
					<td>{appt.instructor}</td>
				</tr>
				})}
			</tbody>
		</Table>
	</CardHeader>
</Card>