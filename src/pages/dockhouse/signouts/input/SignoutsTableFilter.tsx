import * as React from 'react';
import { Button, Label, Table } from 'reactstrap';
import { SelectInput, ValidatedTextInput, SelectOption } from 'components/wrapped/Input';
import { signoutTypesHR, programsHR } from '../Constants';
import { UpdateStateType, wrapForFormComponents } from 'components/table/TableWithModalForm';
import { SignoutType } from 'async/staff/dockhouse/signouts';
import { option } from 'fp-ts';

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
					<SelectInput {...wrapForFormComponents(filterValue, updateState, "boatType", [], true)} selectOptions={props.boatTypesHR} showNone={{value: -1, display: "None"}} selectNone={true} isNumber={true} />
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
					<SelectInput {...wrapForFormComponents(filterValue, updateState, "signoutType", [])} selectOptions={signoutTypesHR} showNone={{value: "", display: "None"}} selectNone={true} />
				</td>
			</tr>
			<tr>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Program
					</Label>
				</td>
				<td style={tdStyle}>
					<SelectInput {...wrapForFormComponents(filterValue, updateState, "programId", [], true)} selectOptions={programsHR} showNone={{value: -1, display: "None"}} selectNone={true} isNumber={true} />
				</td>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Created By
					</Label>
				</td>
				<td style={tdStyle}>
					<SelectInput {...wrapForFormComponents(filterValue, updateState, "createdBy", [])} selectOptions={props.usersHR} showNone={{value: "", display: "None"}} selectNone={true} />
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
	signoutType: option.Option<SignoutType>;
	programId: number;
	nameOrCard: string;
	sail: string;
	personId: string;
	createdBy: string;
};

export function makeInitFilter(): SignoutsTableFilterState {
	return { boatType: -1, nameOrCard: "", sail: "", signoutType: option.none, programId: -1, personId: "", createdBy: "" };
}
