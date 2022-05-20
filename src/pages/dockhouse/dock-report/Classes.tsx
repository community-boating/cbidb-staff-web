import { TabularForm } from '@components/TabularForm';
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Table } from 'reactstrap';
import { Class, DockReportState, SubmitAction } from '.';

export default (props: {
	classes: Class[],
	openModal: (content: JSX.Element) => void,
	setSubmitAction: (submit: SubmitAction) => void
}) => <Card>
	<CardHeader>
		<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
				<EditClassTable classes={props.classes} setSubmitAction={props.setSubmitAction} statekey={"classes"} />
		)} />
		<CardTitle><h4>Classes</h4></CardTitle>

	</CardHeader>
	<CardBody>
		<Table size="sm">
			<tbody>
				<tr>
					<th style={{width: "75px"}}>Time</th>
					<th style={{width: "115px"}}>Class</th>
					<th style={{width: "120px"}}>Location</th>
					<th style={{width: "75px"}}>Attend</th>
					<th>Instructor</th>
				</tr>
				{props.classes.map((c, i) => {
					return <tr key={`row_${i}`}>
					<td>{c.time}</td>
					<td>{c.className}</td>
					<td>{c.location}</td>
					<td>{c.attend}</td>
					<td>{c.instructor}</td>
				</tr>
				})}
			</tbody>
		</Table>
	</CardBody>
</Card>

const EditClassTable = (props: {
	classes: Class[],
	setSubmitAction: (submit: SubmitAction) => void,
	statekey: keyof DockReportState
}) => {
	const [classes, setClasses] = React.useState(props.classes);

	React.useEffect(() => {
		// TODO: validate e.g. attend is a number
		props.setSubmitAction(() => Promise.resolve({[props.statekey]: classes.map(c => ({
			...c,
			attend: Number(c.attend)
		}))}));
	}, [classes]);

	const columns = [{
		Header: "Time",
		accessor: "time",
		cellWidth: 75
	}, {
		Header: "Class",
		accessor: "className",
		cellWidth: 150
	}, {
		Header: "Location",
		accessor: "location",
		cellWidth: 100
	}, {
		Header: "Attend",
		accessor: "attend",
		cellWidth: 75
	}, {
		Header: "Instructor",
		accessor: "instructor"
	}];

	return <div className="form-group row">
		<TabularForm columns={columns} data={classes} setData={setClasses} blankRow={{
			time: "",
			className: "",
			location: "",
			attend: null,
			instructor: ""
		}}/>
	</div>
}
