import * as React from 'react';
import * as _ from 'lodash';
import * as moment from 'moment';

import { padWithZero } from 'util/dateUtil';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Container, CustomInput, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { arrayifyCollection } from 'util/arrayify';
import { hashifyArray } from 'util/hashifyArray';
import { SalesDasboard } from './SalesDashboard';
import "./SalesDashboardPage.scss"

export const SalesDashboardPage = () => {
	const now = moment();
	const thisYear = Number(now.format("YYYY"));

	const [month, setMonth] = React.useState(now.format("MM"));
	const [activeYears, setActiveYears] = React.useState([thisYear, thisYear-1, thisYear-2].map(String));
	const [activeMembershipTypes, setActiveMembershipTypes] = React.useState(["1", "10"])
	const [ready, setReady] = React.useState(false)

	const setFinished = () => {
		setReady(true)
		console.log("WRAPPER RECEIVED READY")
	}

	const overlay = <div className="overlay-wrapper">
		<div className="overlay-column">
			<div className='overlay-cell'>
				<div style={{textAlign: "center"}}>
					Loading...
				</div>
			</div>
		</div>
	</div>;

	const dashboard = React.useMemo(() => <SalesDasboard
		month={Number(month)}
		activeYears={activeYears.map(Number)}
		activeMembershipTypes={hashifyArray(activeMembershipTypes.map(Number))}
		setFinished={setFinished}
	/>, [month, activeYears, activeMembershipTypes])

	const ret = <Container fluid className="p-0">
		{ready ? null : overlay}
		<Row>
			<Card className="col-md-12">
				<CardHeader>
					<CardTitle tag="h5" className="mb-0">Filter</CardTitle>
				</CardHeader>
				<CardBody>
					<Row>
						<Col className="col-md-4">
							<Form>
								<FormGroup row>
									<Label sm={2} className="text-sm-right">
										Month
									</Label>
									<Col sm={10}>
										<Input
											type="select"
											id="month"
											name="month"
											className="mb-3"
											value={month}
											onChange={(event) => setMonth(event.target.value)}
										>
											{_.range(1,12).map(String).map(m => <option key={m} value={padWithZero(m)}>{padWithZero(m)}</option>)}
										</Input>
									</Col>
								</FormGroup>
								<FormGroup row>
									<Label sm={2} className="text-sm-right">
										Years
									</Label>
									<Col sm={10}>
										<CustomInput
											type="select"
											id="years"
											name="years"
											multiple
											value={activeYears}
											onChange={e => {
												const options = (e.target as unknown as HTMLSelectElement).options
												const selectedOptions = arrayifyCollection(options).filter(o => o.selected).map(o => o.value)
												setActiveYears(selectedOptions)
											}}
										>
											<option>2022</option>
											<option>2021</option>
											<option>2020</option>
											<option>2019</option>
										</CustomInput>
									</Col>
								</FormGroup>
							</Form>
						</Col>
						<Col className="col-md-4">
							<Form>
								<FormGroup row>
									<Label sm={2} className="text-sm-right">
										Mem Types
									</Label>
									<Col sm={10}>
										<CustomInput
											type="select"
											id="years"
											name="years"
											multiple
											value={activeMembershipTypes}
											onChange={e => {
												const options = (e.target as unknown as HTMLSelectElement).options
												const selectedOptions = arrayifyCollection(options).filter(o => o.selected).map(o => o.value)
												setActiveMembershipTypes(selectedOptions)
											}}
										>
											<option>1</option>
											<option>10</option>
										</CustomInput>
									</Col>
								</FormGroup>
							</Form>
						</Col>
						<Col className="col-md-4">
							<Button>Submit</Button>
						</Col>
					</Row>
				</CardBody>
			</Card>
		</Row>
		<Row>
			{dashboard}
		</Row>
	</Container>;

	return ret;
}