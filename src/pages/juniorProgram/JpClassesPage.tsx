import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';
import { Card, CardHeader, CardTitle, CardBody, Button, FormGroup, Label, Col, Row, Form } from 'reactstrap';
import { NavLink, Link, useRouteMatch } from 'react-router-dom';
import * as _ from 'lodash';

import { decoratedInstanceValidator, signupValidator, weekValidator, typeValidator } from "@async/staff/all-jp-signups"
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { tableSortByDate, toMomentFromLocalDateTime } from '@util/dateUtil';
import * as moment from 'moment';
import { none, Option } from 'fp-ts/lib/Option';
import FormElementSelect from '@components/form/FormElementSelect';
import {formUpdateStateHooks} from '@util/form-update-state';
import { tableColWidth } from '@util/tableUtil';

type DecoratedInstance = t.TypeOf<typeof decoratedInstanceValidator>

type Props = {
	signups: t.TypeOf<typeof signupValidator>[],
	instances: DecoratedInstance[],
	weeks: t.TypeOf<typeof weekValidator>[],
}

type ClassType = t.TypeOf<typeof typeValidator>

const formDefault = {
	classType: none as Option<string>,
	week: none as Option<string>,
}

type FormType = typeof formDefault;

type State = {
	formData: Form
}

class FormSelect extends FormElementSelect<FormType> { }

export default function JpClassesPage(props: Props) {
	const [formData, setFormData] = React.useState(formDefault);

	const updateState = formUpdateStateHooks(formData, setFormData);

	function generateDateDisplay(m: moment.Moment) {
		return <React.Fragment>{m.format("dddd")}<br />{m.format("MM/DD/YYYY")}</React.Fragment>
	}

	function generateTimeDisplay(m: moment.Moment, sessionLengthHours: number) {
		return m.format("h:mm") + " - " + m.add(sessionLengthHours, 'hours').format("h:mm")
	}


	const types = _.uniq(props.instances.map(i => i.jpClassInstance.TYPE_ID))
		.map(id => props.instances.find(i => i.jpClassInstance.TYPE_ID == id))
		.map(i => ({
			key: String(i.jpClassInstance.TYPE_ID),
			display: i.jpClassInstance.$$jpClassType.TYPE_NAME
		}));

	const weeks = _.uniq(props.instances.map(i => i.week))
	.sort((a, b) => Number(a) - Number(b))
	.map(w => ({
		key: String(w),
		display: "Week " + w
	}))

	const filterByType = (ot: Option<String>) => (i: DecoratedInstance) => ot.map(t => Number(t) == i.jpClassInstance.TYPE_ID).getOrElse(true);
	const filterByWeek = (ow: Option<String>) => (i: DecoratedInstance) => ow.map(w => Number(w) == i.week).getOrElse(true);

	const data = props.instances
		.filter(filterByType(formData.classType))
		.filter(filterByWeek(formData.week))
		.map(i => ({
			instanceId: i.jpClassInstance.INSTANCE_ID,
			typeName: i.jpClassInstance.$$jpClassType.TYPE_NAME,
			week: i.week,
			firstDay: toMomentFromLocalDateTime(i.firstSession),
			firstDayDisplay: generateDateDisplay(toMomentFromLocalDateTime(i.firstSession)),
			firstDayTimestamp: Number(toMomentFromLocalDateTime(i.firstSession).format("X")),
			lastDay: toMomentFromLocalDateTime(i.lastSession),
			lastDayDisplay: generateDateDisplay(toMomentFromLocalDateTime(i.lastSession)),
			classTime: generateTimeDisplay(toMomentFromLocalDateTime(i.lastSession), 1),
			spotsLeftHTML: i.spotsLeftHTML,
		})).sort((a, b) => {
			const timeDiff = a.firstDayTimestamp - b.firstDayTimestamp;
			if (timeDiff != 0) {
				return timeDiff;
			} else {
				return (a.typeName as any) - (b.typeName as any)
			}
		});

	const columns: ColumnDescription<typeof data[0]>[] = [{
		dataField: "instanceId",
		text: "ID",
		...tableColWidth(70)
	}, {
		dataField: "week",
		text: "Week",
		...tableColWidth(70)
	}, {
		dataField: "typeName",
		text: "Class",
	}, {
		dataField: "firstDayDisplay",
		text: "First Day",
	}, {
		dataField: "lastDayDisplay",
		text: "Last Day",
	}, {
		dataField: "classTime",
		text: "Time"
	}, {
		dataField: "spotsLeftHTML",
		text: "Spots Left",
		formatter: (cell, row) => <span dangerouslySetInnerHTML={{ __html: cell }} />
	}];

	return <Card>
		<CardHeader>
			<CardTitle tag="h5" className="mb-0">JP Classes</CardTitle>
		</CardHeader>
		<CardBody>
			<Form>
				<Row form>
					<Col>
						<FormGroup>
							<Label>
								Class Type
							</Label>
							<FormSelect
								id="classType"
								value={formData.classType}
								options={types}
								updateAction={updateState}
								nullDisplay="- Select -"
							/>
						</FormGroup>
					</Col>
					<Col>
						<FormGroup>
							<Label>
								Week
							</Label>
							<FormSelect
								id="week"
								value={formData.week}
								options={weeks}
								updateAction={updateState}
								nullDisplay="- Select -"
							/>
						</FormGroup>
					</Col>
				</Row>
			</Form>
			<BootstrapTable
				keyField="instanceId"
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
	</Card>;
}
