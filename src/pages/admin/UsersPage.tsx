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
import TableWithModalForm, { TableWithModalFormAsyncStringified } from "components/table/TableWithModalForm";
import {  StringifiedProps } from "util/StringifyObjectProps";
import { none, Option, some } from "fp-ts/lib/Option";
import optionify from "util/optionify";
import {accessStateValidator} from 'async/staff/access-state'
import { MAGIC_NUMBERS } from "app/magicNumbers";
import { ColumnDef, sortingFns } from "@tanstack/react-table";
import { CellBooleanIcon, CellOption, SortType, SortTypeOption, SortTypeOptionalString, SortTypeOptionalStringCI } from "util/tableUtil";
import { AppStateContext } from "app/state/AppStateContext";

type User = t.TypeOf<typeof userValidator>
type AccessState = t.TypeOf<typeof accessStateValidator>;

export default function UsersPage(props: { users: User[], accessState: AccessState }) {
	const asc = React.useContext(AppStateContext);
	const decorateRow = (u: User) => ({
		...u, pw1: none as Option<string>, pw2: none as Option<string>, userId: u.userId
	});

	type UserDecorated = ReturnType<typeof decorateRow>;

	const myUser = React.useMemo(() => {
		return props.users.find(u => u.userName.toLowerCase() == asc.state.login.authenticatedUserName.getOrElse("").toLowerCase());
	}, []);

	const canManage = React.useMemo(() => {
		const mySubordinateRoles = props.accessState.accessProfileRelationships.filter(r => true || r.managingProfileId == myUser.accessProfileId);
		return mySubordinateRoles.reduce((hash, e) => {
			hash[e.subordinateProfileId] = true;
			return hash;
		}, {} as {[K: number]: true})
	}, []);

	const blockEdit = React.useMemo(() => {
		return props.users
		.filter(u => !(myUser.accessProfileId == MAGIC_NUMBERS.ACCESS_PROFILE_ID.GLOBAL_ADMIN || canManage[u.accessProfileId]))
		.reduce((hash, u) => {
			hash[String(u.userId)] = true;
			return hash;
		}, {} as {[K: string]: true})
	}, [])

	const mapAccessProfileIdToName = id => optionify(props.accessState.accessProfiles.find(ap => ap.id == id)).map(ap => ap.name).getOrElse("(unknown)")

	const columns: ColumnDef<UserDecorated>[] = [{
		accessorKey: "userId",
		header: "ID",
		size: 50,
	}, {
		accessorKey: "userName",
		header: "Username",
		size: 70,
	}, {
		accessorKey: "nameFirst",
		header: "First Name",
		size: 90,
		cell: CellOption,
		sortingFn: SortTypeOptionalStringCI,
	}, {
		accessorKey: "nameLast",
		header: "Last Name",
		size: 90,
		cell: CellOption,
		sortingFn: SortTypeOptionalStringCI
	}, {
		accessorKey: "accessProfileId",
		header: "Access",
		size: 90,
		cell: ({getValue}) => mapAccessProfileIdToName(getValue()),
		sortingFn: SortType(mapAccessProfileIdToName)
	}, {
		accessorKey: "email",
		header: "Email",
	}, {
		accessorKey: "active",
		header: "Active",
		size: 35,
		cell: CellBooleanIcon(<CheckIcon color="#777" size="1.4em" />)
	}, {
		accessorKey: "hideFromClose",
		header: "Hide From Close",
		size: 65,
		cell: CellBooleanIcon(<CheckIcon color="#777" size="1.4em" />)
	}, {
		accessorKey: "pwChangeRequired",
		header: "Pw Change Reqd",
		size: 50,
		cell: CellBooleanIcon(<CheckIcon color="#777" size="1.4em" />)
	}, {
		accessorKey: "locked",
		header: "Locked",
		size: 35,
		cell: CellBooleanIcon(<LockIcon color="#777" size="1.4em" />)
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
		}, {
			check: user.accessProfileId != "",
			msg:  "Access profile must be specified for new users."
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
						{[<option key="-1" value="">- Select -</option>].concat(props.accessState.accessProfiles
						.filter(ap => myUser.accessProfileId == MAGIC_NUMBERS.ACCESS_PROFILE_ID.GLOBAL_ADMIN || canManage[ap.id])
						.map(ap => <option key={ap.id} value={ap.id}>{ap.name}</option>)
						)}
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
			<TableWithModalFormAsyncStringified
				validator={userValidator}
				rows={props.users.map(decorateRow)}
				keyField="userId"
				columns={columns}
				formComponents={formComponents}
				action={postWrapper}
				addRowText="Add User"
				noCard={true}
				/*validateSubmit={validate}*/
				postSubmit={user => ({ ...user, pw1: none, pw2: none})}
				initialSortBy={[{id: "active", desc: true}, {id: "userName", desc: false}]}
				blockEdit={blockEdit}
			/>
		</CardBody>
	</Card>;
}
