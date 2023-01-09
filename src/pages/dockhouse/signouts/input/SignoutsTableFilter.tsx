import * as React from 'react';
import { Button, Label, Table } from 'reactstrap';
import { ValidatedSelectInput, ValidatedTextInput, SelectOption } from 'components/wrapped/Input';
import { signoutTypesHR, programsHR } from '../Constants';
import { UpdateStateType, wrapForFormComponents } from 'components/table/TableWithModalForm';

export const SignoutsTableFilter = (props: { tdStyle: React.CSSProperties; labelStyle: React.CSSProperties; filterValue: SignoutsTableFilterState; updateState: UpdateStateType; boatTypesHR: SelectOption<number>[]; setFilterValue: (filterValue: SignoutsTableFilterState) => void; usersHR: SelectOption<string>[]}) => {
	const tdStyle = props.tdStyle;
	const labelStyle = props.labelStyle;
	const filterValue = props.filterValue;
	const updateState = props.updateState;
	return (<><Table>
		<tbody>
			<tr>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Name/Card
					</Label>
				</td>
				<td>
					<ValidatedTextInput {...wrapForFormComponents(filterValue, updateState, "nameOrCard", [])} />
				</td>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Boat Type
					</Label>
				</td>
				<td>
					<ValidatedSelectInput {...wrapForFormComponents(filterValue, updateState, "boatType", [], true)} selectOptions={props.boatTypesHR} showNone={{value: -1, display: "None"}} selectNone={true} isNumber={true} />
				</td>
			</tr>
			<tr>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Sail #
					</Label>
				</td>
				<td style={tdStyle}>
					<ValidatedTextInput {...wrapForFormComponents(filterValue, updateState, "sail", [])} />
				</td>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Signout Type
					</Label>
				</td>
				<td style={tdStyle}>
					<ValidatedSelectInput {...wrapForFormComponents(filterValue, updateState, "signoutType", [])} selectOptions={signoutTypesHR} showNone={{value: "", display: "None"}} selectNone={true} />
				</td>
			</tr>
			<tr>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Program
					</Label>
				</td>
				<td style={tdStyle}>
					<ValidatedSelectInput {...wrapForFormComponents(filterValue, updateState, "programId", [], true)} selectOptions={programsHR} showNone={{value: -1, display: "None"}} selectNone={true} isNumber={true} />
				</td>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Created By
					</Label>
				</td>
				<td style={tdStyle}>
					<ValidatedSelectInput {...wrapForFormComponents(filterValue, updateState, "createdBy", [])} selectOptions={props.usersHR} showNone={{value: "", display: "None"}} selectNone={true} />
				</td>
			</tr>
			<tr>
				<td style={tdStyle}>
				</td>
				<td style={tdStyle}>
				</td>
				<td style={tdStyle}>
				</td>
				<td style={tdStyle}>
					<Button onClick={() => props.setFilterValue(makeInitFilter())}>Clear Filters</Button>
				</td>
			</tr>
		</tbody>
	</Table>
	</>);
};

export type SignoutsTableFilterState = {
	boatType: number;
	signoutType: string;
	programId: number;
	nameOrCard: string;
	sail: string;
	personId: string;
	createdBy: string;
};

export function makeInitFilter(): SignoutsTableFilterState {
	return { boatType: -1, nameOrCard: "", sail: "", signoutType: "", programId: -1, personId: "", createdBy: "" };
}
