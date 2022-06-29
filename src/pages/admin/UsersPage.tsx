import * as React from "react";
import * as t from 'io-ts';
import {userValidator, postWrapper} from 'async/staff/user'
import { Card, CardHeader, CardTitle, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label, Col, Button, Input, CustomInput } from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';
import {
	Edit as EditIcon,
	Check as CheckIcon,
	Lock as LockIcon,
	MoreHorizontal,
} from 'react-feather'
import { pathUsersEdit } from "app/paths";
import ReportWithModalForm from "components/ReportWithModalForm";
import {  StringifiedProps } from "util/StringifyObjectProps";
import { none } from "fp-ts/lib/Option";
import { ACCESS_PROFILES } from "models/permissions";
import optionify from "util/optionify";
import { CellBooleanIcon, CellOption, SortType, SortTypeBoolean, SortTypeOptionalNumber, SortTypeOptionalStringCI, SortTypeStringCI } from "util/tableUtil";
import { Column } from "react-table";
import { TableColumnOptionsCbi, TableOptionsCbi } from "react-table-config";

type User = t.TypeOf<typeof userValidator>

export default function UsersPage(props: { users: User[] }) {
	const columns: TableColumnOptionsCbi[] = [{
		accessor: "edit",
		Header: "Edit",
		width: 50,
		disableSortBy: true
	}, {
		accessor: "userId",
		Header: "ID",
		width: 50,
		Cell: CellOption,
		sortType: SortTypeOptionalNumber,
	}, {
		accessor: "userName",
		Header: "Username",
		width: 70,
	}, {
		accessor: "nameFirst",
		Header: "First Name",
		width: 90,
		Cell: CellOption,
		sortType: SortTypeOptionalStringCI
	}, {
		accessor: "nameLast",
		Header: "Last Name",
		width: 90,
		Cell: CellOption,
		sortType: SortTypeOptionalStringCI
	}, {
		accessor: "accessProfileId",
		Header: "Access",
		width: 90,
		Cell: ({value}) => optionify(ACCESS_PROFILES.find(ap => ap.id == value)).map(ap => ap.name).getOrElse("(unknown)"),
		sortType: SortType(id => ACCESS_PROFILES.find(ap => ap.id == id).name)
	}, {
		accessor: "email",
		Header: "Email",
	}, {
		accessor: "active",
		Header: "Active",
		width: 35,
		Cell: CellBooleanIcon(<CheckIcon color="#777" size="1.4em" />),
		sortType: SortTypeBoolean
	}, {
		accessor: "hideFromClose",
		Header: "Hide From Close",
		width: 65,
		Cell: CellBooleanIcon(<CheckIcon color="#777" size="1.4em" />),
		sortType: SortTypeBoolean
	}, {
		accessor: "pwChangeRequired",
		Header: "Pw Change Reqd",
		width: 50,
		Cell: CellBooleanIcon(<CheckIcon color="#777" size="1.4em" />),
		sortType: SortTypeBoolean
	}, {
		accessor: "locked",
		Header: "Locked",
		width: 35,
		Cell: CellBooleanIcon(<LockIcon color="#777" size="1.4em" />),
		sortType: SortTypeBoolean
	}];

	const validate = (user: StringifiedProps<User>)  => {
		return [{
			check: user.userName != "",
			msg:  "Username must be specified."
		}, {
			check: user.email != "",
			msg:  "Email must be specified."
		}, {
			check: user.nameFirst != "",
			msg:  "First name must be specified."
		}, {
			check: user.nameLast != "",
			msg:  "Last name must be specified."
		}, {
			check: user.pw1 == user.pw2,
			msg:  "Passwords do not match."
		}, {
			check: user.userId != "" || user.pw1 != "",
			msg:  "Password must be specified for new users."
		}].filter(v => !v.check).map(v => v.msg)
	}

	const formComponents = (
		rowForEdit: StringifiedProps<User>,
		updateState: (id: string, value: string | boolean) => void
	) => {
		const isCreate = rowForEdit.userId == "";
		return (
			<React.Fragment>
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Username
					</Label>
					<Col sm={9}>
						{
							isCreate
							? <Input
								type="text"
								name="username"
								placeholder="Username"
								value={rowForEdit.userName}
								onBlur={e => {
									e.target.value = e.target.value.toUpperCase()
									updateState("userName", e.target.value)
								}}
								onChange={(event) => updateState("userName", event.target.value)}
							/>
							: <div style={{ padding: "5px" }} className="text-left">
								{ rowForEdit.userName}
							</div>
						}
					</Col>
				</FormGroup>
	
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Email
					</Label>
					<Col sm={9}>
						<Input
							type="email"
							name="email"
							placeholder="Email"
							value={rowForEdit.email}
							onChange={(event) => updateState("email", event.target.value)}
						/>
					</Col>
				</FormGroup>
	
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						First Name
					</Label>
					<Col sm={9}>
						<Input
							type="text"
							name="nameFirst"
							placeholder="First Name"
							value={rowForEdit.nameFirst}
							onChange={(event) => updateState("nameFirst", event.target.value)}
						/>
					</Col>
				</FormGroup>
	
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Last Name
					</Label>
					<Col sm={9}>
						<Input
							type="text"
							name="nameLast"
							placeholder="Last Name"
							value={rowForEdit.nameLast}
							onChange={(event) => updateState("nameLast", event.target.value)}
						/>
					</Col>
				</FormGroup>
	
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Access Profile
					</Label>
					<Col sm={9}>
					<Input
						type="select"
						id="accesProfile"
						name="accesProfile"
						className="mb-3"
						value={rowForEdit.accessProfileId}
						onChange={(event) => updateState("accessProfileId", event.target.value)}
					>
						{ACCESS_PROFILES.map(ap => <option key={ap.id} value={ap.id}>{ap.name}</option>)}
					</Input>
					</Col>
				</FormGroup>
	
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Set Password
					</Label>
					<Col sm={9}>
						<Input
							type="password"
							name="pw1"
							placeholder="Password"
							value={rowForEdit.pw1}
							onChange={(event) => updateState("pw1", event.target.value)}
						/>
					</Col>
				</FormGroup>
	
				<FormGroup row>
					<Label sm={3} className="text-sm-right">
						Confirm Password
					</Label>
					<Col sm={9}>
						<Input
							type="password"
							name="pw2"
							placeholder="Confirm Password"
							value={rowForEdit.pw2}
							onChange={(event) => updateState("pw2", event.target.value)}
						/>
					</Col>
				</FormGroup>
	
				<FormGroup row className="align-items-center">
					<Label sm={3} className="text-sm-right">
						Active
					</Label>
					<Col sm={9}>
						<CustomInput
							type="checkbox"
							id="isActive"
							checked={rowForEdit.active == "Y"}
							className="text-left"
							onChange={(event) => updateState("active", event.target.checked)}
						/>
					</Col>
				</FormGroup>
	
				<FormGroup row className="align-items-center">
					<Label sm={3} className="text-sm-right">
						Hide From Close
					</Label>
					<Col sm={9}>
						<CustomInput
							type="checkbox"
							id="isHideFromClose"
							checked={rowForEdit.hideFromClose == "Y"}
							className="text-left"
							onChange={(event) => updateState("hideFromClose", event.target.checked)}
						/>
					</Col>
				</FormGroup>
	
				<FormGroup row className="align-items-center">
					<Label sm={3} className="text-sm-right">
						PW Change Required
					</Label>
					<Col sm={9}>
						<CustomInput
							type="checkbox"
							id="isPwChangeRqd"
							checked={rowForEdit.pwChangeRequired == "Y"}
							className="text-left"
							onChange={(event) => updateState("pwChangeRequired", event.target.checked)}
						/>
					</Col>
				</FormGroup>
	
				<FormGroup row className="align-items-center">
					<Label sm={3} className="text-sm-right">
						Locked
					</Label>
					<Col sm={9}>
						<CustomInput
							type="checkbox"
							id="isLocked"
							checked={rowForEdit.locked == "Y"}
							className="text-left"
							onChange={(event) => updateState("locked", event.target.checked)}
						/>
					</Col>
				</FormGroup>
	
			</React.Fragment>
		);
	}
	return <Card>
		<CardHeader>
			<CardTitle tag="h5" className="mb-0">Add/Edit Staff</CardTitle>
		</CardHeader>
		<CardBody>
			<ReportWithModalForm
				rowValidator={userValidator}
				rows={props.users.map(u => ({ ...u, pw1: none, pw2: none }))}
				primaryKey="userId"
				columns={columns}
				formComponents={formComponents}
				submitRow={postWrapper}
				addRowText="Add User"
				noCard={true}
				validateSubmit={validate}
				postSubmit={user => ({ ...user, pw1: none, pw2: none})}
				initialSortBy={[{id: "active"}, {id: "userName"}]}
			/>
		</CardBody>
	</Card>;
}
