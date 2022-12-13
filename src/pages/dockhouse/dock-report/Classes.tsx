import { dockReportApClassValidator } from 'async/rest/dock-report';
import * as t from "io-ts";
import { TabularForm } from 'components/table/TabularForm';
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Table } from 'reactstrap';
import { DockReportState, SubmitAction } from '.';
import { Editable } from 'util/EditableType';
import { DATE_FORMAT_LOCAL_DATETIME, toMomentFromLocalDateTime } from 'util/dateUtil';
import optionify from 'util/optionify';
import * as moment from 'moment';
import { combineValidations, validateMilitaryTime, validateNotBlank, validateNumber } from 'util/validate';
import { ERROR_DELIMITER } from 'core/APIWrapper';
import { sortOnCol } from 'util/sort';
import { ColumnDef } from '@tanstack/react-table';
import EditCard from './EditCard';

type Class = t.TypeOf<typeof dockReportApClassValidator>

type ClassNonEditable = "DOCK_REPORT_AP_CLASS_ID" | "DOCK_REPORT_ID" | "AP_INSTANCE_ID"

type ClassEditable = Editable<Class, ClassNonEditable>

const mapToDisplay: (c: Class) => ClassEditable = c => ({
	...c,
	CLASS_NAME: c.CLASS_NAME,
	CLASS_DATETIME:toMomentFromLocalDateTime(c.CLASS_DATETIME).format("HH:mm"),
	LOCATION: c.LOCATION.getOrElse(""),
	INSTRUCTOR: c.INSTRUCTOR.getOrElse(""),
	ATTEND: c.ATTEND.map(String).getOrElse("")
})

const mapToDto: (reportDate: string) => (c: ClassEditable) => Class = reportDate => c => ({
	...c,
	CLASS_NAME: c.CLASS_NAME,
	CLASS_DATETIME: moment(`${reportDate}T${c.CLASS_DATETIME}`, "YYYY-MM-DDTHH:mm").format(DATE_FORMAT_LOCAL_DATETIME),
	LOCATION: optionify(c.LOCATION),
	INSTRUCTOR: optionify(c.INSTRUCTOR),
	ATTEND: optionify(c.ATTEND).map(Number)
})

const sort = (a: ClassEditable, b: ClassEditable) => sortOnCol(a, b, x => x.CLASS_DATETIME)

export default (props: {
	classes: Class[],
	openModal: (content: JSX.Element) => void,
	setSubmitAction: (submit: SubmitAction) => void,
	reportDate: string
}) => {
	const classes = props.classes.map(mapToDisplay)
	return <EditCard title="Classes" openModal={props.openModal} editModal={<EditClassTable classes={classes} setSubmitAction={props.setSubmitAction} statekey={"apClasses"} reportDate={props.reportDate} />}>
			<table>
				<tbody>
					<tr>
						<th style={{width: "75px"}}>Time</th>
						<th style={{width: "115px"}}>Class</th>
						<th style={{width: "120px"}}>Location</th>
						<th style={{width: "75px"}}>Attend</th>
						<th>Instructor</th>
					</tr>
					{props.classes.map(mapToDisplay).sort(sort).map((c, i) => {
						return <tr key={`row_${i}`}>
						<td>{c.CLASS_DATETIME}</td>
						<td>{c.CLASS_NAME}</td>
						<td>{c.LOCATION}</td>
						<td>{c.ATTEND}</td>
						<td>{c.INSTRUCTOR}</td>
					</tr>
					})}
				</tbody>
			</table>
	</EditCard>
}

const EditClassTable = (props: {
	classes: ClassEditable[],
	setSubmitAction: (submit: SubmitAction) => void,
	statekey: keyof DockReportState,
	reportDate: string
}) => {
	const [classes, setClasses] = React.useState(props.classes.sort(sort));

	React.useEffect(() => {
		props.setSubmitAction(() => {
			const errors = combineValidations(
				validateNumber(classes.map(c => c.ATTEND)),
				validateMilitaryTime(classes.map(c => c.CLASS_DATETIME)),
				validateNotBlank("Class", classes.map(c => c.CLASS_NAME)),
				validateNotBlank("Time", classes.map(c => c.CLASS_DATETIME)),
			)
			if (errors.length) return Promise.reject(errors.join(ERROR_DELIMITER))
			else return Promise.resolve({[props.statekey]: classes.map(mapToDto(props.reportDate))});
		});
	}, [classes]);

	const columns: ColumnDef<ClassEditable>[] = [{
		header: () => <>Time <img src="/images/required.png" /></>,
		accessorKey: "CLASS_DATETIME",
		size: 75,
		meta: {
			readonly: true
		}
	}, {
		header: () => <>Class <img src="/images/required.png" /></>,
		accessorKey: "CLASS_NAME",
		size: 150,
		meta: {
			readonly: true
		}
	}, {
		header: "Location",
		accessorKey: "LOCATION",
		size: 250
	}, {
		header: "Attend",
		accessorKey: "ATTEND",
		size: 75
	}, {
		header: "Instructor",
		accessorKey: "INSTRUCTOR"
	}];

	return <div className="form-group row">
		<TabularForm columns={columns} data={classes} setData={setClasses}/>
	</div>
}
