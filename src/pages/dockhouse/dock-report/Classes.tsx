import * as React from 'react';
import { Card, CardHeader, CardTitle, Table } from 'reactstrap';

const classes = [{
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}]

export default () => <Card>
	<CardHeader>
		<CardTitle><h4>Classes</h4></CardTitle>
		<Table size="sm">
			<tbody>
				<tr>
					<th style={{width: "75px"}}>Time</th>
					<th style={{width: "95px"}}>Class</th>
					<th style={{width: "120px"}}>Location</th>
					<th style={{width: "75px"}}>Attend</th>
					<th>Instructor</th>
				</tr>
				{classes.map(c => {
					return <tr>
					<td>{c.time}</td>
					<td>{c.className}</td>
					<td>{c.location}</td>
					<td>{c.attend}</td>
					<td>{c.instructor}</td>
				</tr>
				})}
			</tbody>
		</Table>
	</CardHeader>
</Card>