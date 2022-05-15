import optionify from '@util/optionify';
import * as moment from 'moment'
import * as React from 'react';
import { Card, CardHeader, CardTitle, Table } from 'reactstrap';

export default (props: {
	date: string,
	sunset?: string,
	setSunset: (sunset: string) => void
}) => {
	const dateMoment = moment(props.date, "MM/DD/YYYY");
	const hiper = optionify(props.sunset)
		.map(time => moment(`${props.date} ${time}`, "MM/DD/YYYY HH:mm").subtract(30, "minutes").format("HH:mm"))
		.getOrElse(null);

	return <Card>
		<CardHeader>
			<CardTitle><h2>Dock Report</h2></CardTitle>
			<Table size="sm">
				<tbody>
					<tr>
						<th>Date</th>
						<td>{props.date}</td>
					</tr>
					<tr>
						<th>Day</th>
						<td>{dateMoment.format("dddd")}</td>
					</tr>
					<tr>
						<th> <a href="#" onClick={() => { const s = window.prompt(); props.setSunset(s);}}>Sunset</a></th>
						<td>{props.sunset}</td>
					</tr>
					<tr>
						<th>Hiper</th>
						<td>{hiper}</td>
					</tr>
				</tbody>
			</Table>
		</CardHeader>
	</Card>;
}