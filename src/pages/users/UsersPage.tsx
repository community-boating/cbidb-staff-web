import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';
import { validator } from "../../async/staff/get-users"
import { Card, CardHeader, CardTitle, CardBody, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { NavLink, Link, useRouteMatch } from 'react-router-dom';
import { usersEditPageRoute } from '../../app/routes/users';
import {
	Edit as EditIcon,
	Check as CheckIcon,
	Lock as LockIcon,
	MoreHorizontal,
} from 'react-feather'


export default function UsersPage(props: { users: t.TypeOf<typeof validator> }) {
	const { path, url } = useRouteMatch();
	const editWidth = "50px";
	const columns = [{
		dataField: "edit",
		text: "",
		style: { width: editWidth },
		headerStyle: { width: editWidth }
	}, {
		dataField: "userId",
		text: "ID",
		sort: true
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
		dataField: "email",
		text: "email",
		sort: true
	}, {
		dataField: "active",
		text: "Active",
		sort: true
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
		userId: u.userId.getOrElse(-1),
		email: u.email.getOrElse(""),
		username: u.username.getOrElse(""),
		nameFirst: u.nameFirst.getOrElse(""),
		nameLast: u.nameLast.getOrElse(""),
		locked: u.locked.getOrElse(false) ? <LockIcon color="#777" size="1.4em" /> : null,
		active: u.active.getOrElse(false) ? <CheckIcon color="#777" size="1.4em" /> : null,
		pwChangeRequired: u.pwChangeRequired.getOrElse(false) ? <CheckIcon color="#777" size="1.4em" /> : null,
		edit: <NavLink to={usersEditPageRoute.getPathFromArgs({ userId: String(u.userId.getOrElse(-1)) })}><EditIcon color="#777" size="1.4em" /></NavLink>
	}))
	return <Card>
		<CardHeader>
			<div className="card-actions float-right">
				<UncontrolledDropdown>
					<DropdownToggle tag="a">
						<MoreHorizontal />
					</DropdownToggle>
					<DropdownMenu right>
						<DropdownItem><Link to={usersEditPageRoute.getPathFromArgs({ userId: String("new") })}>Create</Link></DropdownItem>
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
