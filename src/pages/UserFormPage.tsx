import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';
import { validator } from "../async/staff/get-users"
import { Card, CardHeader, CardTitle, CardBody, Form, FormGroup, Label, Col, Input, Button, CustomInput, Row } from 'reactstrap';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { NavLink } from 'react-router-dom';
import { usersPageRoute } from '../app/routes/users';

export interface Props {
	userId: number
}

export default class UserFormPage extends React.PureComponent<Props> {
	render() {
		return <Card>
			<CardHeader>
				<CardTitle tag="h5" style={{ margin: "0" }}>Create/Edit User</CardTitle>
			</CardHeader>
			<CardBody>
				<Form>
					<FormGroup row>
						<Label sm={2} className="text-sm-right">
							Email
						</Label>
						<Col sm={10}>
							<Input type="email" name="email" placeholder="Email" />
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label sm={2} className="text-sm-right">
							Password
						</Label>
						<Col sm={10}>
							<Input type="password" name="password" placeholder="Password" />
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label sm={2} className="text-sm-right">
							Textarea
						</Label>
						<Col sm={10}>
							<Input
								type="textarea"
								name="textarea"
								placeholder="Textarea"
								rows="3"
							/>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label sm={2} className="text-sm-right pt-sm-0">
							Radios
						</Label>
					</FormGroup>
					<FormGroup row>
						<Label sm={2} className="text-sm-right pt-sm-0">
							Checkbox
						</Label>
						<Col sm={10}>
							<CustomInput
								type="checkbox"
								id="checkbox"
								label="Check me out"
								disabled
							/>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label sm={2} className="text-sm-right pt-sm-0" />
						<Col sm={10}>
							<div className="btn-list">
								<NavLink to={usersPageRoute.getPathFromArgs({})}><Button outline color="primary" className="mr-1">Cancel</Button></NavLink>
								<Button color="primary">Submit</Button>
							</div>
						</Col>
					</FormGroup>
				</Form>
			</CardBody>
		</Card>
	}
}
