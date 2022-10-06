import * as React from 'react'
import * as t from "io-ts";
import {accessStateValidator} from 'async/staff/access-state'
import { Table } from 'reactstrap';
import { ROLES } from 'models/permissions';

type AccessState = t.TypeOf<typeof accessStateValidator>;

export const ManageAccessPage = (props: {accessState: AccessState}) => {
	const profiles = props.accessState.accessProfiles;
	return <Table>
		<thead><tr style={{height: "120px"}}>
			<td style={{border: "1px solid #dee2e6"}}></td>
			{profiles.map((e, i) => <td style={{border: "1px solid #dee2e6"}} className="rotate-th" key={`profile_${i}`}>{`${e.name} (${e.id})`}</td>)}	
		</tr></thead>
		<tbody>
			{props.accessState.roles.map((role, i) => <tr>
				<td style={{border: "1px solid #dee2e6"}}>{role.name}</td>
				{props.accessState.accessProfiles.map((profile, i) =>
					<td style={{border: "1px solid #dee2e6"}}>
						{profile.roles.find(r => r == role.id) ? "X" : ""}
					</td>
				)}
			</tr>)}
		</tbody>
	</Table>
}