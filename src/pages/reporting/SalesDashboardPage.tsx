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
	const nowYear = Number(now.format("YYYY"));

	const [month, setMonth] = React.useState("-1");
	const [activeYears, setActiveYears] = React.useState([nowYear, nowYear-1, nowYear-2].map(String));
	const [activeMembershipTypes, setActiveMembershipTypes] = React.useState([])
	const [ready, setReady] = React.useState(false)
	const [submitDashboardProps, setSubmitDashboardProps] = React.useState({ activeYears, activeMembershipTypes });
	const [submitPropsDirty, setSubmitPropsDirty] = React.useState(false);
	const [expandMemTypes, setExpandMemTypes] = React.useState(false);
	const [useClosedDate, setUseClosedDate] = React.useState(false);
	const [voidByErase, setVoidByErase] = React.useState(false);
	const [bySeason, setbySeason] = React.useState(false)

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
			useClosedDate={useClosedDate}
			voidByErase={voidByErase}
			bySeason={bySeason}
			setNotReady={() => {
				setReady(false)
				console.log("WRAPPER RECEIVED READY")
			}}
			setReady={() => {
				setReady(true)
				console.log("WRAPPER RECEIVED READY")
			}}
		/>
	}, [month, submitDashboardProps, useClosedDate, voidByErase, bySeason]);

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
						<Col className="col-md-3">
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
								<FormGroup row>
									<Label sm={4} className="text-sm-right">
										Purchase/Close
									</Label>
									<Col sm={8}>
										<Input
											type="select"
											id="dateSelect"
											name="dateSelect"
											className="mb-3"
											value={useClosedDate ? "1" : "0"}
											onChange={(event) => {
												setUseClosedDate(event.target.value == "1")
											}}
										>
											<option value={"0"}>Purchase Date</option>
											<option value={"1"}>Closed Date</option>
										</Input>
									</Col>
								</FormGroup>
								<FormGroup row>
									<Label sm={4} className="text-sm-right">
										Void Handling
									</Label>
									<Col sm={8}>
										<Input
											type="select"
											id="voidSelect"
											name="voidSelect"
											className="mb-3"
											value={voidByErase ? "1" : "0"}
											onChange={(event) => {
												setVoidByErase(event.target.value == "1")
											}}
										>
											<option value={"0"}>-1 on void date</option>
											<option value={"1"}>Like it never happened</option>
										</Input>
									</Col>
								</FormGroup>
								<FormGroup row>
									<Label sm={4} className="text-sm-right">
										Cumul. Start on
									</Label>
									<Col sm={8}>
										<Input
											type="select"
											id="startOn"
											name="startOn"
											className="mb-3"
											value={bySeason ? "1" : "0"}
											onChange={(event) => {
												setbySeason(event.target.value == "1")
											}}
										>
											<option value={"0"}>January (Calendar Year)</option>
											<option value={"1"}>November (Season)</option>
										</Input>
									</Col>
								</FormGroup>
								{bySeason ? <span style={{color:"#888"}}>{`("Nov/Dec ${nowYear} SEASON" means Nov/Dec ${nowYear-1})`}</span> : ""}
							</Form>
						</Col>
						<Col className="col-md-3">
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
											{_.range(2013, nowYear+1).reverse().map(y =><option key={y} value={y}>{y}{y==2020?"🦠":""}</option> )}
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
						<Col className="col-md-1">
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