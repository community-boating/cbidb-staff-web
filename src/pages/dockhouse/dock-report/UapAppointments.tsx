import { TabularForm } from '@components/TabularForm';
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Table } from 'reactstrap';
import { SubmitAction, UapAppointment } from '.';

type Props = {
	appts: UapAppointment[],
	openModal: (content: JSX.Element) => void,
	setSubmitAction: (submit: SubmitAction) => void
}

const EditUapAppts = (props: {
	appts: UapAppointment[],
	setSubmitAction: (submit: SubmitAction) => void
}) => {
	const [appts, setAppts] = React.useState(props.appts);

	React.useEffect(() => {
		props.setSubmitAction(() => Promise.resolve({"uapAppts": appts}));
	}, [appts]);

	const columns = [{
		Header: "Time",
		accessor: "time",
		cellWidth: 75
	}, {
		Header: "Appt Type",
		accessor: "apptType",
		cellWidth: 75
	}, {
		Header: "Person",
		accessor: "person"
	}, {
		Header: "Boat",
		accessor: "boat",
		cellWidth: 95
	}, {
		Header: "Instructor",
		accessor: "instructor",
		cellWidth: 185
	}];

	const blankRow: UapAppointment = {
		time: "",
		apptType: "",
		person: "",
		boat: "",
		instructor: ""
	}

	return <div className="form-group row">
		<TabularForm columns={columns} data={appts} setData={setAppts} blankRow={blankRow}/>
	</div>
}

export default (props: Props) => <Card>
	<CardHeader>
		<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
			<EditUapAppts appts={props.appts} setSubmitAction={props.setSubmitAction} />
		)} />
		<CardTitle><h4>UAP Appointments</h4></CardTitle>
	</CardHeader>
	<CardBody>
		<Table size="sm">
			<tbody>
				<tr>
					<th style={{width: "75px"}}>Time</th>
					<th style={{width: "95px"}}>Appt Type</th>
					<th>Person</th>
					<th style={{width: "75px"}}>Boat</th>
					<th style={{width: "120px"}}>Instructor</th>
				</tr>
				{props.appts.map((appt, i) => {
					return <tr key={`row_${i}`}>
					<td>{appt.time}</td>
					<td>{appt.apptType}</td>
					<td>{appt.person}</td>
					<td>{appt.boat}</td>
					<td>{appt.instructor}</td>
				</tr>
				})}
			</tbody>
		</Table>
	</CardBody>
</Card>