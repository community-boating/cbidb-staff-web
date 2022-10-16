import * as React from 'react';
import * as _ from 'lodash';
import * as moment from 'moment';

import { padWithZero } from 'util/dateUtil';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Container, CustomInput, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { arrayifyCollection } from 'util/arrayify';
import { hashifyArray } from 'util/hashifyArray';
import { SalesDasboard } from './SalesDashboard';
import "./SalesDashboardPage.scss"
import months from 'models/months';
import { MembershipType } from 'async/rest/membership-types';

export const SalesDashboardPage = (props: {membershipTypes: MembershipType[]}) => {
	const now = moment();
	const thisYear = Number(now.format("YYYY"));

	const [month, setMonth] = React.useState(now.format("MM"));
	const [activeYears, setActiveYears] = React.useState([thisYear, thisYear-1, thisYear-2].map(String));
	const [activeMembershipTypes, setActiveMembershipTypes] = React.useState([])
	const [ready, setReady] = React.useState(false)
	const [submitDashboardProps, setSubmitDashboardProps] = React.useState({ activeYears, activeMembershipTypes });
	const [submitPropsDirty, setSubmitPropsDirty] = React.useState(false);
	const [expandMemTypes, setExpandMemTypes] = React.useState(false);

	// mark dirty when props change...
	React.useEffect(() => {
		setSubmitPropsDirty(true);
	}, [activeYears, activeMembershipTypes])

	// ...except on first load
	React.useEffect(() => {
		setSubmitPropsDirty(false);
	}, [])

	const dashboard = React.useMemo(() => {
		console.log("generating dashboard ", submitDashboardProps);
		return <SalesDasboard
			month={Number(month)}
			activeYears={submitDashboardProps.activeYears.map(Number)}
			activeMembershipTypes={hashifyArray(submitDashboardProps.activeMembershipTypes.map(Number))}
			setNotReady={() => {
				setReady(false)
				console.log("WRAPPER RECEIVED READY")
			}}
			setReady={() => {
				setReady(true)
				console.log("WRAPPER RECEIVED READY")
			}}
		/>
	}, [month, submitDashboardProps]);

	function submit() {
		setSubmitPropsDirty(false)
		setSubmitDashboardProps({ activeYears, activeMembershipTypes })
	}

	function toggleExpandMemTypes(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		e.preventDefault();
		setExpandMemTypes(!expandMemTypes)
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

	const ret = <Container fluid className="p-0">
		{ready ? null : overlay}
		<Row>
			<Card className="col-md-12">
				<CardHeader>
					<CardTitle tag="h5" className="mb-0">Filter</CardTitle>
				</CardHeader>
				<CardBody>
					<Row>
						<Col className="col-md-2">
							<Form>
								<FormGroup row>
									<Label sm={4} className="text-sm-right">
										Month
									</Label>
									<Col sm={8}>
										<Input
											type="select"
											id="month"
											name="month"
											className="mb-3"
											value={month}
											onChange={(event) => {
												setMonth(event.target.value)
											}}
										>
											<option key={-1} value={-1}>(All Months)</option>
											{months.map(m => <option key={m.key} value={padWithZero(String(m.key))}>{`${padWithZero(String(m.key))} - ${m.name}`}</option>)}
										</Input>
									</Col>
								</FormGroup>
							</Form>
						</Col>
						<Col className="col-md-2">
							<Form>
								<FormGroup row>
									<Label sm={4} className="text-sm-right">
										Years
									</Label>
									<Col sm={8}>
										<CustomInput
											type="select"
											id="years"
											name="years"
											multiple
											value={activeYears}
											size={6}
											onChange={e => {
												const options = (e.target as unknown as HTMLSelectElement).options
												const selectedOptions = arrayifyCollection(options).filter(o => o.selected).map(o => o.value)
												setActiveYears(selectedOptions)
											}}
										>
											{_.range(2013, thisYear+1).reverse().map(y =><option key={y} value={y}>{y}{y==2020?"🦠":""}</option> )}
										</CustomInput>
									</Col>
								</FormGroup>
							</Form>
						</Col>
						<Col className="col-md-4">
							<Form>
								<FormGroup row>
									<Label sm={3} className="text-sm-right">
										Mem Types <a href="#" style={{fontFamily: "monospace"}} onClick={toggleExpandMemTypes}>{expandMemTypes?"(-)":"(+)"}</a>
									</Label>
									<Col sm={9}>
										<CustomInput
											type="select"
											id="years"
											name="years"
											multiple
											value={activeMembershipTypes}
											size={expandMemTypes ? props.membershipTypes.length : 6}
											onChange={e => {
												const options = (e.target as unknown as HTMLSelectElement).options
												const selectedOptions = arrayifyCollection(options).filter(o => o.selected).map(o => o.value)
												setActiveMembershipTypes(selectedOptions)
											}}
										>
											{props.membershipTypes.map(t => 
												<option key={t.membershipTypeId} value={String(t.membershipTypeId)}>{t.membershipTypeName}</option>
											)}
										</CustomInput>
									</Col>
								</FormGroup>
							</Form>
						</Col>
						<Col className="col-md-2">
							<Button color={submitPropsDirty?"danger":"secondary"} onClick={submit}>Submit</Button>
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