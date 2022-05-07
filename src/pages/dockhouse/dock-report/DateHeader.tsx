import * as React from 'react';
import { Card, CardHeader, CardTitle, Table } from 'reactstrap';

export default () => <Card>
<CardHeader>
	<CardTitle><h2>Dock Report</h2></CardTitle>
	<Table size="sm">
		<tbody>
			<tr>
				<th>Date</th>
				<td>5/7/2022</td>
			</tr>
			<tr>
				<th>Day</th>
				<td>Saturday</td>
			</tr>
			<tr>
				<th>Sunset</th>
				<td>18:00</td>
			</tr>
			<tr>
				<th>Hiper</th>
				<td>17:30</td>
			</tr>
		</tbody>
	</Table>
</CardHeader>
</Card>