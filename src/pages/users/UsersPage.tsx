import * as React from "react";
import * as t from 'io-ts';
import { validator } from "../../async/staff/get-users"
import { Card, CardHeader, CardTitle, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { NavLink, Link } from 'react-router-dom';
import {
	Edit as EditIcon,
	Check as CheckIcon,
	Lock as LockIcon,
	MoreHorizontal,
} from 'react-feather'
import { tableColWidth } from '@util/tableUtil';
import { userTypeDisplay } from 'models/UserType';
import { pathUsersEdit } from "@app/paths";


export default function UsersPage(props: { users: t.TypeOf<typeof validator> }) {
	const columns = [{
		dataField: "edit",
		text: "",
		...tableColWidth(50),
	}, {
		dataField: "userId",
		text: "ID",
		sort: true,
		...tableColWidth(80),
	}, {
		dataField: "username",
		text: "Username",
		sort: true
	}, {
		dataField: "nameFirst",
		text: "First Name",
		sort: true
	}, {
		dataField: "nameLast",
		text: "Last Name",
		sort: true
	}, {
		dataField: "role",
		text: "Role",
		sort: true,
	}, {
		dataField: "email",
		text: "email",
		sort: true
	}, {
		dataField: "active",
		text: "Active",
		sort: true,
		...tableColWidth(100),
	}, {
		dataField: "pwChangeRequired",
		text: "Pw Change Reqd",
		sort: true
	}, {
		dataField: "locked",
		text: "Locked",
		sort: true
	}];
	const data = props.users.map(u => ({
		userId: u.USER_ID,
		email: u.EMAIL,
		username: u.USER_NAME,
		nameFirst: u.NAME_FIRST.getOrElse(""),
		nameLast: u.NAME_LAST.getOrElse(""),
		role: userTypeDisplay(u.USER_TYPE.getOrElse("")),
		locked: u.LOCKED ? <LockIcon color="#777" size="1.4em" /> : null,
		active: u.ACTIVE ? <CheckIcon color="#777" size="1.4em" /> : null,
		pwChangeRequired: u.PW_CHANGE_REQD ? <CheckIcon color="#777" size="1.4em" /> : null,
		edit: <NavLink to={pathUsersEdit.getPathFromArgs({ userId: String(u.USER_ID) })}><EditIcon color="#777" size="1.4em" /></NavLink>
	}))
	return <Card>
		<CardHeader>
			<div className="card-actions float-right">
				<UncontrolledDropdown>
					<DropdownToggle tag="a">
						<MoreHorizontal />
					</DropdownToggle>
					<DropdownMenu right>
					<Link to={pathUsersEdit.getPathFromArgs({ userId: String("new") })}><DropdownItem>Create</DropdownItem></Link>
					</DropdownMenu>
				</UncontrolledDropdown>
			</div>
			<CardTitle tag="h5" className="mb-0">Add/Edit Staff</CardTitle>
		</CardHeader>
		<CardBody>
			<div>
				
			</div>
			<BootstrapTable
				keyField="userId"
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
