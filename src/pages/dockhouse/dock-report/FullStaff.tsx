import { TabularForm } from '@components/TabularForm';
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap';
import { DockReportState, Staff, SubmitAction } from '.';

type Props = {
	staff: Staff[],
	openModal: (content: JSX.Element) => void,
	setSubmitAction: (submit: SubmitAction) => void
}

function makeStaffTable(staff: Staff[]) {
	return <Table size="sm">
		<tbody>
			<tr>
				<th>Name</th>
				<th style={{ width: "75px" }}>In</th>
				<th style={{ width: "75px" }}>Out</th>
			</tr>
			{staff.map((e, i) => {
				return <tr key={`row_${i}`}>
					<td>{e.name}</td>
					<td>{e.in}</td>
					<td>{e.out}</td>
				</tr>
			})}
		</tbody>
	</Table>
}

const StaffTable = (props: Props & { title: string, staff: Staff[], statekey: keyof DockReportState }) => <Card>
	<CardHeader style={{ borderBottom: "none", paddingBottom: 0 }}>
		<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
			<EditStaffTable staff={props.staff} setSubmitAction={props.setSubmitAction} statekey={props.statekey} />
		)} />
		<CardTitle tag="h2" className="mb-0">{props.title}</CardTitle>
	</CardHeader>
	<CardBody>
		{makeStaffTable(props.staff)}
	</CardBody>
</Card>;

export const DockmastersReport = (props: Props) => <StaffTable {...props} title="Dockmaster" staff={props.staff} statekey="dockmasters"/>

export const StaffReport = (props: Props) => <StaffTable {...props} title="Staff" staff={props.staff} statekey="dockstaff"/>

/////////////////////////////////////////////////////////////////////////////////


const EditStaffTable = (props: {
	staff: Staff[],
	setSubmitAction: (submit: SubmitAction) => void,
	statekey: keyof DockReportState
}) => {
	const [staff, setStaff] = React.useState(props.staff);

	React.useEffect(() => {
		// console.log("setting submit action ", staff)
		props.setSubmitAction(() => Promise.resolve({[props.statekey]: staff}));
	}, [staff]);

	const columns = [{
		Header: "Name",
		accessor: "name"
	}, {
		Header: "In",
		accessor: "in",
		cellWidth: 75
	}, {
		Header: "Out",
		accessor: "out",
		cellWidth: 75
	}];

	return <div className="form-group row">
		<TabularForm columns={columns} data={staff} setData={setStaff} blankRow={{name: "", in: "", out: ""}}/>
	</div>
}
