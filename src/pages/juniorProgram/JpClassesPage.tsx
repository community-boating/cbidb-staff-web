import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';
import { validator } from "../../async/staff/get-users"
import { Card, CardHeader, CardTitle, CardBody, Button } from 'reactstrap';
import { NavLink, Link, useRouteMatch } from 'react-router-dom';

import {decoratedInstanceValidator, signupValidator} from "@async/staff/all-jp-signups"

type Props = {
	signups: t.TypeOf<typeof signupValidator>[],
	instances: t.TypeOf<typeof decoratedInstanceValidator>[]
}

export default function JpClassesPage(props: Props) {
	return <Card>
		<CardHeader>
			<CardTitle tag="h5" className="mb-0">Jp Classes</CardTitle>
		</CardHeader>
		<CardBody>
			{JSON.stringify(props.signups)}
		</CardBody>
	</Card>;
}
