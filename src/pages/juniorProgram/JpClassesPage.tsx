import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';
import { validator } from "../../async/staff/get-users"
import { Card, CardHeader, CardTitle, CardBody, Button } from 'reactstrap';
import { NavLink, Link, useRouteMatch } from 'react-router-dom';

import {decoratedInstanceValidator, signupValidator, weekValidator} from "@async/staff/all-jp-signups"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { toMomentFromLocalDateTime } from '@util/dateUtil';
import * as moment from 'moment';

type Props = {
	signups: t.TypeOf<typeof signupValidator>[],
	instances: t.TypeOf<typeof decoratedInstanceValidator>[],
	weeks: t.TypeOf<typeof weekValidator>[],
}

export default function JpClassesPage(props: Props) {
	function generateDateDisplay(m: moment.Moment) {
		return <React.Fragment>{m.format("dddd")}<br />{m.format("MM/DD/YYYY")}</React.Fragment>
	}
	const columns = [{
		dataField: "instanceId",
		text: "ID",
		sort: true
	}, {
		dataField: "week",
		text: "Week",
		sort: true
	}, {
		dataField: "typeName",
		text: "Class",
		sort: true
	}, {
		dataField: "firstDayDisplay",
		text: "First Day",
		sort: true,
		sortFunc: (a, b, order, dataField, rowA, rowB) => {
			const momentA = rowA["firstDay"] as moment.Moment;
			const momentB = rowB["firstDay"] as moment.Moment;
			const delta = Number(momentA.format('X')) - Number(momentB.format('X'));
			if (order === 'asc') {
			  return delta;
			} else {
				return -1 * delta;
			}
		}
	}];
	const data = props.instances.map(i => ({
		instanceId: i.jpClassInstance.INSTANCE_ID,
		typeName: i.jpClassInstance.$$jpClassType.TYPE_NAME,
		week: i.week,
		firstDay: toMomentFromLocalDateTime(i.firstSession),
		firstDayDisplay: generateDateDisplay(toMomentFromLocalDateTime(i.firstSession))
	}))
	return <Card>
		<CardHeader>
			<CardTitle tag="h5" className="mb-0">JP Classes</CardTitle>
		</CardHeader>
		<CardBody>
		<BootstrapTable
				keyField="instanceId"
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
