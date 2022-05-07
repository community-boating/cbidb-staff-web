import * as React from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Container, Row, Table } from 'reactstrap';
import Classes from './Classes';
import DateHeader from './DateHeader';
import HullCounts from './HullCounts';
import Staff from './Staff';
import UapAppointments from './UapAppointments';
import WeatherTable from './WeatherTable';

const incidents = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"

const incidentsCard = <Card>
	<CardHeader><CardTitle><h4>Incidents/Notes</h4></CardTitle></CardHeader>
	<CardBody>{incidents}</CardBody>
</Card>

const announcementsCard = <Card>
	<CardHeader><CardTitle><h4>Announcements</h4></CardTitle></CardHeader>
	<CardBody>{incidents}</CardBody>
</Card>

export const DockReportPage = ({ }) => {
	return <><Row>
		<Col md="2">
			<DateHeader />
		</Col>
		<Col md="6">
			<WeatherTable />
		</Col>
		<Col md="4">
			<UapAppointments />
		</Col>
	</Row>
	<Row>
		<Col md="6">
			{incidentsCard}
		</Col>
		<Col md="6">
			{announcementsCard}
		</Col>
	</Row>
	<Row>
		<Col md="6">
			<Classes />
		</Col>
		<Col md="3">
			<Staff />
		</Col>
		<Col md="3">
			<HullCounts />
		</Col>
	</Row></>
}