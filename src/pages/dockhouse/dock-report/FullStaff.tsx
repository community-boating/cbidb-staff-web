import { dockReportStaffValidator } from '@async/rest/dock-report';
import * as t from "io-ts";
import { TabularForm } from '@components/TabularForm';
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap';
import { DockReportState, SubmitAction } from '.';
import { Editable } from '@util/EditableType';
import * as moment from 'moment'
import { DATE_FORMAT_LOCAL_DATETIME } from '@util/dateUtil';

type Staff = t.TypeOf<typeof dockReportStaffValidator>

type StaffNonEditable = "DOCK_REPORT_STAFF_ID" | "DOCK_REPORT_ID" | "DOCKMASTER_ON_DUTY"

type StaffEditable = Editable<Staff, StaffNonEditable>

type Props = {
	staff: Staff[],
	openModal: (content: JSX.Element) => void,
	setSubmitAction: (submit: SubmitAction) => void,
	reportDate: string
}

const mapToDisplay: (staff: Staff) => StaffEditable = s => ({
	...s,
	TIME_IN: moment(s.TIME_IN, DATE_FORMAT_LOCAL_DATETIME).format("HH:MM"),
	TIME_OUT: moment(s.TIME_OUT, DATE_FORMAT_LOCAL_DATETIME).format("HH:MM")
})

const mapToDto: (reportDate: string) => (s: StaffEditable) => Staff = reportDate => s => ({
	...s,
	TIME_IN: moment(`${reportDate}T${s.TIME_IN}`, "YYYY-MM-DDTHH:mm").format(DATE_FORMAT_LOCAL_DATETIME),
	TIME_OUT: moment(`${reportDate}T${s.TIME_OUT}`, "YYYY-MM-DDTHH:mm").format(DATE_FORMAT_LOCAL_DATETIME),
})

function makeStaffTable(staff: StaffEditable[]) {
	return <Table size="sm">
		<tbody>
			<tr>
				<th>Name</th>
				<th style={{ width: "75px" }}>In</th>
				<th style={{ width: "75px" }}>Out</th>
			</tr>
			{staff.map((e, i) => {
				return <tr key={`row_${i}`}>
					<td>{e.STAFF_NAME}</td>
					<td>{e.TIME_IN}</td>
					<td>{e.TIME_OUT}</td>
				</tr>
			})}
		</tbody>
	</Table>
}

const StaffTable = (props: Props & { staff: Staff[], dockmaster: boolean }) => {
	const title = (
		props.dockmaster
		? "Dockmasters"
		: "Dockstaff"
	);

	const statekey: keyof DockReportState = (
		props.dockmaster
		? "dockmasters"
		: "dockstaff"
	);

	const staffToDisplay = props.staff.map(mapToDisplay);

	return <Card>
		<CardHeader style={{ borderBottom: "none", paddingBottom: 0 }}>
			<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
				<EditStaffTable staff={staffToDisplay} setSubmitAction={props.setSubmitAction} statekey={statekey} reportDate={props.reportDate} dockmaster={props.dockmaster}/>
			)} />
			<CardTitle tag="h2" className="mb-0">{title}</CardTitle>
		</CardHeader>
		<CardBody>
			{makeStaffTable(staffToDisplay)}
		</CardBody>
	</Card>
};

export const DockmastersReport = (props: Props) => <StaffTable {...props} staff={props.staff} dockmaster={true}/>

export const StaffReport = (props: Props) => <StaffTable {...props} staff={props.staff} dockmaster={false}/>

/////////////////////////////////////////////////////////////////////////////////


const EditStaffTable = (props: {
	staff: StaffEditable[],
	setSubmitAction: (submit: SubmitAction) => void,
	statekey: keyof DockReportState,
	reportDate: string,
	dockmaster: boolean
}) => {
	const [staff, setStaff] = React.useState(props.staff);

	React.useEffect(() => {
		console.log("setting submit action ", staff)
		console.log("statekey ", props.statekey)
		console.log("dockmaster ", props.dockmaster)
		props.setSubmitAction(() => Promise.resolve({[props.statekey]: staff.map(mapToDto(props.reportDate))}));
	}, [staff]);

	const columns = [{
		Header: "Name",
		accessor: "STAFF_NAME"
	}, {
		Header: "In",
		accessor: "TIME_IN",
		cellWidth: 75
	}, {
		Header: "Out",
		accessor: "TIME_OUT",
		cellWidth: 75
	}];

	const blankRow: Staff = {
		DOCK_REPORT_ID: null,
		DOCK_REPORT_STAFF_ID: null,
		DOCKMASTER_ON_DUTY: props.dockmaster,
		STAFF_NAME: "", 
		TIME_IN: "",
		TIME_OUT: ""
	}

	return <div className="form-group row">
		<TabularForm columns={columns} data={staff} setData={setStaff} blankRow={blankRow}/>
	</div>
}
