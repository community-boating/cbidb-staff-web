import * as React from 'react';
import { Card, CardHeader, CardTitle, Table } from 'reactstrap';

const hullTypes = [
    "Kayak",
    "SUP",
]

const counts = [{
	hullType: "Kayak",
    count: 45
}, {
	hullType: "SUP",
    count: 12
}]

export default () => <Card>
	<CardHeader>
		<CardTitle><h4>Hull Inventory</h4></CardTitle>
		<Table size="sm">
			<tbody>
				<tr>
					<th>Hull</th>
					<th style={{width: "75px"}}>In Svc</th>
					<th style={{width: "75px"}}>Nightly Ct</th>
				</tr>
				{hullTypes.map((h, i) => {
                    const countObj = counts.find(c => c.hullType == h);
					return <tr key={`row_${i}`}>
					<td style={{textAlign: "right"}}>{h}</td>
					<td>{countObj && countObj.count}</td>
					<td>{countObj && countObj.count}</td>
				</tr>
				})}
			</tbody>
		</Table>
	</CardHeader>
</Card>

