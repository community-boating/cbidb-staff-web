import * as React from "react";
import * as t from 'io-ts';
import { Card, CardHeader, CardTitle, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {  Link } from 'react-router-dom';
import { usersEditPageRoute } from '../../app/routes/users';
import {

	MoreHorizontal,
} from 'react-feather'
import { tableColWidth } from '@util/tableUtil';
import {classInstructorValidator} from '@async/rest/class-instructor'

type ClassInstructor = t.TypeOf<typeof classInstructorValidator>;


export default function ManageClassInstructorsPage(props: { instructors: ClassInstructor[] }) {
	const columns = [{
		dataField: "edit",
		text: "",
		...tableColWidth(50),
	}, {
		dataField: "instructorId",
		text: "ID",
		sort: true,
		...tableColWidth(80),
	}, {
		dataField: "nameFirst",
		text: "First Name",
		sort: true
	}, {
		dataField: "nameLast",
		text: "Last Name",
		sort: true
	}];
	const data = props.instructors.map(i => ({
		instructorId: i.INSTRUCTOR_ID,
		nameFirst: i.NAME_FIRST,
		nameLast: i.NAME_LAST,
	}))
	return <Card>
		<CardHeader>
			<div className="card-actions float-right">
				<UncontrolledDropdown>
					<DropdownToggle tag="a">
						<MoreHorizontal />
					</DropdownToggle>
					<DropdownMenu right>
					<Link to={usersEditPageRoute.getPathFromArgs({ userId: String("new") })}><DropdownItem>Add Instructor</DropdownItem></Link>
					</DropdownMenu>
				</UncontrolledDropdown>
			</div>
			<CardTitle tag="h5" className="mb-0">JP Class Instructors</CardTitle>
		</CardHeader>
		<CardBody>
			<div>
				
			</div>
			<BootstrapTable
				keyField="instructorId"
				data={data}
				columns={columns}
				bootstrap4
				bordered={false}
				pagination={paginationFactory({
					sizePerPage: 10,
					sizePerPageList: [5, 10, 25, 50]
				})}
			/>
		</CardBody>
	</Card>;
}
