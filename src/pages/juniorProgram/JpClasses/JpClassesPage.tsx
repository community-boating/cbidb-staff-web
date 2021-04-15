import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';
import { Card, CardHeader, CardTitle, CardBody, Button, FormGroup, Label, Col, Row, Form } from 'reactstrap';
import { NavLink, Link, useRouteMatch } from 'react-router-dom';
import * as _ from 'lodash';

import { decoratedInstanceValidator, signupValidator, weekValidator, typeValidator, staggerValidator } from "@async/staff/all-jp-signups"
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { sortOnMoment, toMomentFromLocalDateTime } from '@util/dateUtil';
import * as moment from 'moment';
import { none, Option, some } from 'fp-ts/lib/Option';
import FormElementSelect from '@components/form/FormElementSelect';
import {formUpdateStateHooks} from '@util/form-update-state';
import { tableColWidth } from '@util/tableUtil';
import JpClassSignupsRegion from './JpClassSignupsRegion';
import {faAngleRight, faAngleDown, faUsers} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Printer} from 'react-feather'

type DecoratedInstance = t.TypeOf<typeof decoratedInstanceValidator>
type Stagger = t.TypeOf<typeof staggerValidator>;
type Signup = t.TypeOf<typeof signupValidator>;

type Props = {
	signups: Signup[],
	instances: DecoratedInstance[],
	weeks: t.TypeOf<typeof weekValidator>[],
	staggers: Stagger[],
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
	const [selectedInstance, selectInstance] = React.useState(none as Option<number>);

	const updateState = formUpdateStateHooks(formData, setFormData);

	function generateDateDisplay(m: moment.Moment) {
		return <React.Fragment>{m.format("dddd")}<br />{m.format("MM/DD/YYYY")}</React.Fragment>
	}

	function generateTimeDisplay(m: moment.Moment, sessionLengthHours: number) {
		return m.format("h:mm") + " - " + m.add(sessionLengthHours, 'hours').format("h:mm")
	}

	function generateStaggerDisplay(s: Stagger): string {
		const m = toMomentFromLocalDateTime(s.STAGGER_DATE)
		return `${s.OCCUPANCY} seats - ${m.format("M/DD H:MMA")} (${m.format("ddd")})`.replace(' ', '\xa0');
	}

	function findAndFormatStaggers(i: DecoratedInstance, ss: Stagger[]): React.ReactNode {
		const staggers = ss
			.filter(s => s.INSTANCE_ID == i.jpClassInstance.INSTANCE_ID)
			.sort(sortOnMoment(s => toMomentFromLocalDateTime(s.STAGGER_DATE)));

		return <ul>
			{staggers.map(s => <li>{generateStaggerDisplay(s)}</li>)}
		</ul>
	}

	function groupSignupsBySection(signups: Signup[]) {
		const hashSectionCountsByName = signups.reduce((agg, s) => {
			const sectionName = s.$$section.map(sec => sec.$$sectionLookup.SECTION_NAME).getOrElse("(none)");
			agg[sectionName] = (agg[sectionName] || 0) + 1;
			return agg;
		}, {} as {[K: string]: number});
		
		return <ul>
			{Object.keys(hashSectionCountsByName).map(name => <li>{`${name}: ${hashSectionCountsByName[name]}`}</li>)}
		</ul>;
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
		}));

	const filterByType = (ot: Option<String>) => (i: DecoratedInstance) => ot.map(t => Number(t) == i.jpClassInstance.TYPE_ID).getOrElse(true);
	const filterByWeek = (ow: Option<String>) => (i: DecoratedInstance) => ow.map(w => Number(w) == i.week).getOrElse(true);

	const filteredInstances = props.instances
		.filter(filterByType(formData.classType))
		.filter(filterByWeek(formData.week));

	const data = filteredInstances
		.map(i => {
			const firstSessionMoment = toMomentFromLocalDateTime(i.firstSession);
			const lastSessionMoment = toMomentFromLocalDateTime(i.lastSession);
			const signups = props.signups.filter(s => s.INSTANCE_ID == i.jpClassInstance.INSTANCE_ID);
			const hasGroupSignups = signups.filter(s => s.GROUP_ID.isSome()).length > 0;
			return {
				instanceId: i.jpClassInstance.INSTANCE_ID,
				typeName: i.jpClassInstance.$$jpClassType.TYPE_NAME,
				week: i.week,
				firstDay: firstSessionMoment,
				firstDayDisplay: generateDateDisplay(firstSessionMoment),
				firstDayTimestamp: Number(firstSessionMoment.format("X")),
				lastDay: lastSessionMoment,
				lastDayDisplay: generateDateDisplay(lastSessionMoment),
				classTime: generateTimeDisplay(lastSessionMoment, i.sessionLength),
				spotsLeftHTML: i.spotsLeftHTML,
				staggers: findAndFormatStaggers(i, props.staggers),
				groups: hasGroupSignups ? <FontAwesomeIcon
					icon={faUsers}
					size="2x"
				/> : null,
				print: <a style={{color: "black"}} href={"/api/pdf/jp-roster?instanceIds=" + i.jpClassInstance.INSTANCE_ID} target="_blank"><Printer /></a>,
				sectionData: groupSignupsBySection(signups.filter(s => s.SIGNUP_TYPE == "E"))
			}
		}).sort((a, b) => {
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
		...tableColWidth(70),
	}, {
		dataField: "print",
		text: "Print",
		...tableColWidth(70)
	}, {
		dataField: "week",
		text: "Week",
		...tableColWidth(70)
	}, {
		dataField: "typeName",
		text: "Class"
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
		dataField: "groups",
		text: "Groups",
		...tableColWidth(80),
	}, {
		dataField: "spotsLeftHTML",
		text: "Spots Left",
		formatter: (cell, row) => <span dangerouslySetInnerHTML={{ __html: cell }} />
	}, {
		dataField: "staggers",
		text: "Staggers",
		...tableColWidth(280)
	}, {
		dataField: "sectionData",
		text: "Sections"
	}];

	const signupsRegion = selectedInstance.map(id => <Card>
		<CardHeader>
			<CardTitle tag="h5" className="mb-0">Selected Class</CardTitle>
		</CardHeader>
		<CardBody>
			<JpClassSignupsRegion signups={props.signups.filter(s => s.INSTANCE_ID == id)}/>
		</CardBody>
	</Card>).getOrElse(null);

	const printAll = (
		formData.week.isSome()
		? <FormGroup>
			<Label>
				Print All
			</Label>
			<div className="mb-3 form-control">
				<a
					style={{color: "black"}}
					href={"/api/pdf/jp-roster?instanceIds=" + filteredInstances.map(i => i.jpClassInstance.INSTANCE_ID).join(",")}
					target="_blank"
				>
					<Printer />3
				</a>
			</div>
		</FormGroup>
		: null
	);

	return <React.Fragment>
		<Card>
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
						<Col>
							{printAll}
						</Col>
					</Row>
				</Form>
				<BootstrapTable
					keyField="instanceId"
					data={data}
					columns={columns}
					bootstrap4
					bordered={false}
					selectRow={{
						mode: "radio",
						clickToSelect: false,
						bgColor: () => "#fff2f2",
						onSelect: (row) => {
							selectInstance(some(row.instanceId))
						},
						selectionRenderer: ({checked}) => <FontAwesomeIcon
							style={{cursor: "pointer"}}
							icon={checked ? faAngleDown : faAngleRight}
							size="2x"
						/>
					}}
					pagination={paginationFactory({
						sizePerPage: 10,
						sizePerPageList: [5, 10, 25, 50]
					})}
				/>
			</CardBody>
		</Card>
		{signupsRegion}
	</React.Fragment>;
}
