import { dockReportApClassValidator } from '@async/rest/dock-report';
import * as t from "io-ts";
import { TabularForm } from '@components/TabularForm';
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Table } from 'reactstrap';
import { DockReportState, SubmitAction } from '.';
import { Editable } from '@util/EditableType';
import { DATE_FORMAT_LOCAL_DATETIME, toMomentFromLocalDateTime } from '@util/dateUtil';
import optionify from '@util/optionify';
import * as moment from 'moment';

type Class = t.TypeOf<typeof dockReportApClassValidator>

type ClassNonEditable = "DOCK_REPORT_AP_CLASS_ID" | "DOCK_REPORT_ID" | "AP_INSTANCE_ID"

type ClassEditable = Editable<Class, ClassNonEditable>

const mapToDisplay: (c: Class) => ClassEditable = c => ({
	...c,
	CLASS_NAME: c.CLASS_NAME.getOrElse(""),
	CLASS_DATETIME: c.CLASS_DATETIME.map(d => toMomentFromLocalDateTime(d).format("HH:mm")).getOrElse(""),
	LOCATION: c.LOCATION.getOrElse(""),
	INSTRUCTOR: c.INSTRUCTOR.getOrElse(""),
	ATTEND: c.ATTEND.map(String).getOrElse("")
})

const mapToDto: (reportDate: string) => (c: ClassEditable) => Class = reportDate => c => ({
	...c,
	CLASS_NAME: optionify(c.CLASS_NAME),
	CLASS_DATETIME: optionify(c.CLASS_DATETIME).map(time => moment(`${reportDate}T${time}`, "YYYY-MM-DDTHH:mm").format(DATE_FORMAT_LOCAL_DATETIME)),
	LOCATION: optionify(c.LOCATION),
	INSTRUCTOR: optionify(c.INSTRUCTOR),
	ATTEND: optionify(c.ATTEND).map(Number)
})

export default (props: {
	classes: Class[],
	openModal: (content: JSX.Element) => void,
	setSubmitAction: (submit: SubmitAction) => void,
	reportDate: string
}) => {
	const classes = props.classes.map(mapToDisplay)
	return <Card>
		<CardHeader style={{borderBottom: "none", paddingBottom: 0}}>
			<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
					<EditClassTable classes={classes} setSubmitAction={props.setSubmitAction} statekey={"apClasses"} reportDate={props.reportDate} />
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
					{props.classes.map(mapToDisplay).map((c, i) => {
						return <tr key={`row_${i}`}>
						<td>{c.CLASS_DATETIME}</td>
						<td>{c.CLASS_NAME}</td>
						<td>{c.LOCATION}</td>
						<td>{c.ATTEND}</td>
						<td>{c.INSTRUCTOR}</td>
					</tr>
					})}
				</tbody>
			</Table>
		</CardBody>
	</Card>
}

const EditClassTable = (props: {
	classes: ClassEditable[],
	setSubmitAction: (submit: SubmitAction) => void,
	statekey: keyof DockReportState,
	reportDate: string
}) => {
	const [classes, setClasses] = React.useState(props.classes);

	React.useEffect(() => {
		// TODO: validate e.g. attend is a number
		props.setSubmitAction(() => Promise.resolve({[props.statekey]: classes.map(mapToDto(props.reportDate))}));
	}, [classes]);

	const columns = [{
		Header: "Time",
		accessor: "CLASS_DATETIME",
		cellWidth: 75
	}, {
		Header: "Class",
		accessor: "CLASS_NAME",
		cellWidth: 150
	}, {
		Header: "Location",
		accessor: "LOCATION",
		cellWidth: 100
	}, {
		Header: "Attend",
		accessor: "ATTEND",
		cellWidth: 75
	}, {
		Header: "Instructor",
		accessor: "INSTRUCTOR"
	}];

	return <div className="form-group row">
		<TabularForm columns={columns} data={classes} setData={setClasses} blankRow={{
			DOCK_REPORT_AP_CLASS_ID: null,
			DOCK_REPORT_ID: null,
			AP_INSTANCE_ID: null,
			CLASS_DATETIME: "",
			CLASS_NAME: "",
			LOCATION: "",
			ATTEND: "",
			INSTRUCTOR: ""
		}}/>
	</div>
}
