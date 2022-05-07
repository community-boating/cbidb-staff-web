import * as React from 'react';
import { Card, CardHeader, CardTitle, Table } from 'reactstrap';

const hullTypes = [
    "Yellow S Kayak",
    "Pink S Kayak",
    "Pink D Kayak",
    "SUP(white)",
    "Windsurf (non-foil)",
    "Yellow Ocean D",
    "Maintenance",
]

const counts = [{
	hullType: "Yellow S Kayak",
    count: 4
}]

export default () => <Card>
	<CardHeader>
		<CardTitle><h4>Hull Inventory</h4></CardTitle>
		<Table size="sm">
			<tbody>
				<tr>
					<th>Hull</th>
					<th style={{width: "55px"}}>Ct</th>
				</tr>
				{hullTypes.map(h => {
                    const countObj = counts.find(c => c.hullType == h);
					return <tr>
					<td style={{textAlign: "right"}}>{h}</td>
					<td>{countObj && countObj.count}</td>
				</tr>
				})}
			</tbody>
		</Table>
	</CardHeader>
</Card>

