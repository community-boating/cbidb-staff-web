import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';
import { validator } from "../../async/staff/get-users"
import { Card, CardHeader, CardTitle, CardBody, Button } from 'reactstrap';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { NavLink, Link, useRouteMatch } from 'react-router-dom';
import { usersEditPageRoute } from '../../app/routes/users';
import {
	Edit as EditIcon,
	Check as CheckIcon,
	Lock as LockIcon,
} from 'react-feather'


export default function JpClassesPage() {
	const {path, url} = useRouteMatch();
	const editWidth = "50px";
	
	return <Card>
		<CardHeader>
			<CardTitle tag="h5" className="mb-0">Jp Classes</CardTitle>
		</CardHeader>
		<CardBody>
			
		</CardBody>
	</Card>;
}
