import * as React from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Container, Row, Table } from 'reactstrap';
import DateHeader from './DateHeader';
import UapAppointments from './UapAppointments';
import WeatherTable from './WeatherTable';

export const DockReportPage = ({ }) => {
	return <Row>
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
}