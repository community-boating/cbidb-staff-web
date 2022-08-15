import * as React from "react";
import { Table } from "reactstrap";

interface Props {
	Name: string;
	Relation: string;
	"Primary Phone": string;
	"Alternate Phone"?: string;
}

export default function EmergencyContact(props: { contact?: Props }) {
	const { contact } = props;

	return (
		<div className="emergency-contact">
			{contact ? (
				<Table className="m-0">
					<tbody>
						{Object.entries(contact).map(([key, value]) => {
							return (
								<tr key={key.replace(" ", "_")}>
									<th className="text-right">{key}</th>
									<td>{value}</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			) : (
				<em>No contact provided.</em>
			)}
		</div>
	);
}
