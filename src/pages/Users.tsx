import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';
import { validator } from "../async/staff/get-users"
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

export interface Props {
	users: t.TypeOf<typeof validator>
}

export default class UsersPage extends React.PureComponent<Props> {
	render() {
		const columns = [{
			dataField: "userId",
			text: "ID",
			sort: true
		}, {
			dataField: "userName",
			text: "Username",
			sort: true
		}];
		const data = this.props.users
		return <Card>
			<CardHeader>
				<CardTitle tag="h5">Pagination</CardTitle>
				<h6 className="card-subtitle text-muted">
					Pagination by react-bootstrap-table2
		  </h6>
			</CardHeader>
			<CardBody>
				<BootstrapTable
					keyField="userId"
					data={data}
					columns={columns}
					bootstrap4
					bordered={false}
					pagination={paginationFactory({
						sizePerPage: 5,
						sizePerPageList: [5, 10, 25, 50]
					})}
				/>
			</CardBody>
		</Card>
	}
}
