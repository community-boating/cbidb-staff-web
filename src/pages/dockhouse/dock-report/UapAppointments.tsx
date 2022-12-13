import { dockReportUapApptValidator } from 'async/rest/dock-report';
import * as t from "io-ts";
import { TabularForm } from 'components/table/TabularForm';
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Input, Table } from 'reactstrap';
import { SubmitAction } from '.';
import { Editable } from 'util/EditableType';
import * as moment from 'moment'
import { DATE_FORMAT_LOCAL_DATETIME } from 'util/dateUtil';
import optionify from 'util/optionify';
import { combineValidations, validateMilitaryTime, validateNotBlank } from 'util/validate';
import { ERROR_DELIMITER } from 'core/APIWrapper';
import { DropDownCell } from 'components/table/DropDownCell';
import { MAGIC_NUMBERS } from 'app/magicNumbers';
import { charToNullableBool, nullableBoolToChar } from 'util/boolean-to-char';
import { ColumnDef } from '@tanstack/react-table';
import EditCard from './EditCard';

type UapAppointment = t.TypeOf<typeof dockReportUapApptValidator>

type UapAppointmentNonEditable = "DOCK_REPORT_APPT_ID" | "DOCK_REPORT_ID"

type UapAppointmentEditable = Editable<UapAppointment, UapAppointmentNonEditable>

const apptTypes = [
	"Open Sailing",
	"Sailing Lesson",
	"Recreational Sail",
	"Orientation and First Sail",
	"Group Sailing Lesson",
	"Keelboat Racing",
];

const boatTypes = [{
	key: MAGIC_NUMBERS.BOAT_TYPE_ID.SONAR,
	display: "Sonar"
}, {
	key: MAGIC_NUMBERS.BOAT_TYPE_ID.KEEL_MERCURY,
	display: "Keel Merc"
}, {
	key: MAGIC_NUMBERS.BOAT_TYPE_ID.IDEAL_18,
	display: "Ideal"
}, {
	key: MAGIC_NUMBERS.BOAT_TYPE_ID.VENTURE,
	display: "Venture"
}, {
	key: MAGIC_NUMBERS.BOAT_TYPE_ID.RHODES_19,
	display: "Rhodes 19"
}]

const mapToDisplay: (u: UapAppointment) => UapAppointmentEditable = u => ({
	...u,
	BOAT_TYPE_ID: u.BOAT_TYPE_ID.map(String).getOrElse(""),
	APPT_TYPE: u.APPT_TYPE.getOrElse(""),
	INSTRUCTOR_NAME: u.INSTRUCTOR_NAME.getOrElse(""),
	APPT_DATETIME: u.APPT_DATETIME.map(dt => moment(dt, DATE_FORMAT_LOCAL_DATETIME).format("HH:mm")).getOrElse(""),
	HOYER: nullableBoolToChar(u.HOYER)
})

const mapToDto: (reportDate: string) => (u: UapAppointmentEditable) => UapAppointment = reportDate => u => ({
	...u,
	BOAT_TYPE_ID: optionify(u.BOAT_TYPE_ID).map(Number),
	APPT_TYPE: optionify(u.APPT_TYPE),
	INSTRUCTOR_NAME: optionify(u.INSTRUCTOR_NAME),
	APPT_DATETIME: optionify(u.APPT_DATETIME).map(dt => moment(`${reportDate}T${dt}`, "YYYY-MM-DDTHH:mm").format(DATE_FORMAT_LOCAL_DATETIME)),
	HOYER: charToNullableBool(u.HOYER)
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
				validateNotBlank("Appt Type", appts.map(c => c.APPT_TYPE)),
				validateNotBlank("Boat", appts.map(c => c.BOAT_TYPE_ID)),
				validateMilitaryTime(appts.map(c => c.APPT_DATETIME)),
			)
			if (errors.length) return Promise.reject(errors.join(ERROR_DELIMITER))
			else return Promise.resolve({ uapAppts: appts.map(mapToDto(props.reportDate)) })
		});
	}, [appts]);

	const columns: ColumnDef<UapAppointment>[] = [{
		header: () => <>Time <img src="/images/required.png" /></>,
		accessorKey: "APPT_DATETIME",
		size: 75
	}, {
		header: () => <>Appt Type <img src="/images/required.png" /></>,
		accessorKey: "APPT_TYPE",
		size: 250,
		meta: {
			updateableCell: DropDownCell(apptTypes.map(t => ({
				key: t,
				display: t
			})))
		}
	}, {
		header: () => <>Person <img src="/images/required.png" /></>,
		accessorKey: "PARTICIPANT_NAME"
	}, {
		header: () => <>Boat <img src="/images/required.png" /></>,
		accessorKey: "BOAT_TYPE_ID",
		size: 140,
		meta: {
			updateableCell: DropDownCell(boatTypes)
		}
	}, {
		header: "Hoyer",
		accessorKey: "HOYER",
		size: 90,
		meta: {
			updateableCell: DropDownCell([{
				key: "N",
				display: "No"
			}, {
				key: "Y",
				display: "Yes"
			}])
		}
	}, {
		header: "Instructor",
		accessorKey: "INSTRUCTOR_NAME",
		size: 200
	}];

	const blankRow: UapAppointmentEditable = {
		DOCK_REPORT_APPT_ID: null,
		DOCK_REPORT_ID: null,
		APPT_DATETIME: "",
		APPT_TYPE: "",
		PARTICIPANT_NAME: "",
		BOAT_TYPE_ID: "",
		INSTRUCTOR_NAME: "",
		HOYER: "",
	}

	return <div className="form-group row">
		<TabularForm columns={columns} data={appts} setData={setAppts} blankRow={blankRow} />
	</div>
}

export default (props: Props) => {
	const appts = props.appts.map(mapToDisplay)
	return <EditCard title="UAP Appointments" openModal={props.openModal} editModal={<EditUapAppts appts={appts} setSubmitAction={props.setSubmitAction} reportDate={props.reportDate} />}>
			<table>
				<tbody>
					<tr>
						<th style={{ width: "75px" }}>Time</th>
						<th style={{ width: "160px" }}>Appt Type</th>
						<th>Person</th>
						<th style={{ width: "75px" }}>Boat</th>
						<th style={{ width: "75px" }}>Hoyer</th>
						<th style={{ width: "180px" }}>Instructor</th>
					</tr>
					{appts.map((appt, i) => {
						return <tr key={`row_${i}`}>
							<td>{appt.APPT_DATETIME}</td>
							<td>{appt.APPT_TYPE}</td>
							<td>{appt.PARTICIPANT_NAME}</td>
							<td>{(boatTypes.find(b => String(b.key) == appt.BOAT_TYPE_ID) || {display: ""}).display}</td>
							<td>{appt.HOYER}</td>
							<td>{appt.INSTRUCTOR_NAME}</td>
						</tr>
					})}
				</tbody>
			</table>
	</EditCard>
}