import { dockReportUapApptValidator } from '@async/rest/dock-report';
import * as t from "io-ts";
import { TabularForm } from '@components/table/TabularForm';
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Input, Table } from 'reactstrap';
import { SubmitAction } from '.';
import { Editable } from '@util/EditableType';
import * as moment from 'moment'
import { DATE_FORMAT_LOCAL_DATETIME } from '@util/dateUtil';
import optionify from '@util/optionify';
import { combineValidations, validateMilitaryTime, validateNotBlank } from '@util/validate';
import { ERROR_DELIMITER } from '@core/APIWrapper';
import { Column } from 'react-table';
import { DropDownCell } from '@components/table/DropDownCell';

type UapAppointment = t.TypeOf<typeof dockReportUapApptValidator>

type UapAppointmentNonEditable = "DOCK_REPORT_APPT_ID" | "DOCK_REPORT_ID"

type UapAppointmentEditable = Editable<UapAppointment, UapAppointmentNonEditable>

const mapToDisplay: (u: UapAppointment) => UapAppointmentEditable = u => ({
	...u,
	BOAT_TYPE_ID: u.BOAT_TYPE_ID.map(String).getOrElse(""),
	APPT_TYPE: u.APPT_TYPE.getOrElse(""),
	INSTRUCTOR_NAME: u.INSTRUCTOR_NAME.getOrElse(""),
	APPT_DATETIME: u.APPT_DATETIME.map(dt => moment(dt, DATE_FORMAT_LOCAL_DATETIME).format("HH:MM")).getOrElse("")
})

const mapToDto: (reportDate: string) => (u: UapAppointmentEditable) => UapAppointment = reportDate => u => ({
	...u,
	BOAT_TYPE_ID: optionify(u.BOAT_TYPE_ID).map(Number),
	APPT_TYPE: optionify(u.APPT_TYPE),
	INSTRUCTOR_NAME: optionify(u.INSTRUCTOR_NAME),
	APPT_DATETIME: optionify(u.APPT_DATETIME).map(dt => moment(`${reportDate}T${dt}`, "YYYY-MM-DDTHH:mm").format(DATE_FORMAT_LOCAL_DATETIME))
})

type Props = {
	appts: UapAppointment[],
	openModal: (content: JSX.Element) => void,
	setSubmitAction: (submit: SubmitAction) => void,
	reportDate: string
}

const EditUapAppts = (props: {
	appts: UapAppointmentEditable[],
	setSubmitAction: (submit: SubmitAction) => void,
	reportDate: string
}) => {
	const [appts, setAppts] = React.useState(props.appts);

	React.useEffect(() => {
		props.setSubmitAction(() => {
			const errors = combineValidations(
				validateNotBlank("Time", appts.map(c => c.APPT_DATETIME)),
				validateNotBlank("Person", appts.map(c => c.PARTICIPANT_NAME)),
				// validateNotBlank("Appt Type", appts.map(c => c.APPT_TYPE)),
				// validateNotBlank("Boat", appts.map(c => c.BOAT_TYPE_ID)),
				validateMilitaryTime(appts.map(c => c.APPT_DATETIME)),
			)
			if (errors.length) return Promise.reject(errors.join(ERROR_DELIMITER))
			else return Promise.resolve({ uapAppts: appts.map(mapToDto(props.reportDate)) })
		});
	}, [appts]);

	const columns = [{
		Header: <>Time <img src="/images/required.png" /></>,
		accessor: "APPT_DATETIME",
		cellWidth: 75
	}, {
		Header: <>Appt Type <img src="/images/required.png" /></>,
		accessor: "APPT_TYPE",
		cellWidth: 90
	}, {
		Header: <>Person <img src="/images/required.png" /></>,
		accessor: "PARTICIPANT_NAME"
	}, {
		Header: <>Boat <img src="/images/required.png" /></>,
		accessor: "BOAT_TYPE_ID",
		cellWidth: 125,
		Cell: DropDownCell([{
			key: 1,
			display: "Mercury"
		}, {
			key: 2,
			display: "Sonar"
		}])
	}, {
		Header: "Instructor",
		accessor: "INSTRUCTOR_NAME",
		cellWidth: 185
	}];

	const blankRow: UapAppointmentEditable = {
		DOCK_REPORT_APPT_ID: null,
		DOCK_REPORT_ID: null,
		APPT_DATETIME: "",
		APPT_TYPE: "",
		PARTICIPANT_NAME: "",
		BOAT_TYPE_ID: "",
		INSTRUCTOR_NAME: "",
	}

	return <div className="form-group row">
		<TabularForm columns={columns} data={appts} setData={setAppts} blankRow={blankRow} />
	</div>
}

export default (props: Props) => {
	const appts = props.appts.map(mapToDisplay)
	return <Card>
		<CardHeader style={{ borderBottom: "none", paddingBottom: 0 }}>
			<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
				<EditUapAppts appts={appts} setSubmitAction={props.setSubmitAction} reportDate={props.reportDate} />
			)} />
			<CardTitle><h4>UAP Appointments</h4></CardTitle>
		</CardHeader>
		<CardBody>
			<Table size="sm">
				<tbody>
					<tr>
						<th style={{ width: "75px" }}>Time</th>
						<th style={{ width: "95px" }}>Appt Type</th>
						<th>Person</th>
						<th style={{ width: "75px" }}>Boat</th>
						<th style={{ width: "120px" }}>Instructor</th>
					</tr>
					{appts.map((appt, i) => {
						return <tr key={`row_${i}`}>
							<td>{appt.APPT_TYPE}</td>
							<td>{appt.APPT_TYPE}</td>
							<td>{appt.PARTICIPANT_NAME}</td>
							<td>{appt.BOAT_TYPE_ID}</td>
							<td>{appt.INSTRUCTOR_NAME}</td>
						</tr>
					})}
				</tbody>
			</Table>
		</CardBody>
	</Card>
}