import * as React from 'react';
import { Button, Label, Table } from 'reactstrap';
import { ValidatedSelectInput, ValidatedTextInput, wrapForFormComponents, SelectOption } from './ValidatedInput';
import { makeInitFilter } from '../SignoutsTablesPage';
import { signoutTypesHR, programsHR } from '../Constants';
import { UpdateStateType } from 'components/ReportWithModalForm';

const optionsMap = (a: SelectOption) => ({value: String(a.display), display: a.display});

export const SignoutsTableFilter = (props: { tdStyle: React.CSSProperties; labelStyle: React.CSSProperties; filterValue: SignoutsTableFilterState; updateState: UpdateStateType; boatTypesHR: SelectOption[]; setFilterValue: (filterValue: SignoutsTableFilterState) => void; usersHR: SelectOption[]}) => {
	const tdStyle = props.tdStyle;
	const labelStyle = props.labelStyle;
	const filterValue = props.filterValue;
	const updateState = props.updateState;
	const boatTypes = React.useMemo(() => props.boatTypesHR.map(optionsMap), [props.boatTypesHR]);
	const signoutTypes = React.useMemo(() => signoutTypesHR.map(optionsMap), []);
	const programs = React.useMemo(() => programsHR.map(optionsMap), []);
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
					<ValidatedSelectInput {...wrapForFormComponents(filterValue, updateState, "boatType", [])} selectOptions={boatTypes} showNone="None" selectNone={true} />
				</td>
			</tr>
			<tr>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Sail
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
					<ValidatedSelectInput {...wrapForFormComponents(filterValue, updateState, "signoutType", [])} selectOptions={signoutTypes} showNone="None" selectNone={true} />
				</td>
			</tr>
			<tr>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Program
					</Label>
				</td>
				<td style={tdStyle}>
					<ValidatedSelectInput {...wrapForFormComponents(filterValue, updateState, "programId", [])} selectOptions={programs} showNone="None" selectNone={true} />
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
	boatType: string;
	signoutType: string;
	programId: string;
	nameOrCard: string;
	sail: string;
	personId: string;
};
