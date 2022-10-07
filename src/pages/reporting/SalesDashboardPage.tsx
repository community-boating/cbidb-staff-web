import * as React from 'react';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';
import * as moment from 'moment';
import HighchartsReact from 'highcharts-react-official';

import {SalesRecord, getWrapper, mapSalesRecord} from "async/rest/membership-sale"
import { padWithZero } from 'util/dateUtil';
import { Card, CardBody, CardHeader, CardTitle, Col, Container, CustomInput, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { Profiler } from 'util/profiler';
import { arrayifyCollection } from 'util/arrayify';
import { hashifyArray } from 'util/hashifyArray';

type SalesState = {
	[K: number]: SalesRecord[]
}

type ActiveMembershipTypes = {
	[K: number]: true
}

export const SalesDashboardPage = () => {
	const p = new Profiler();
	const now = moment();
	const [month, setMonth] = React.useState(now.format("MM"));
	const [sales, setSales] = React.useState({} as SalesState);
	const [activeYears, setActiveYears] = React.useState([2022, 2021, 2020]);
	const [ready, setReady] = React.useState(false)
	const [activeMembershipTypes, setActiveMembershipTypes] = React.useState(null as ActiveMembershipTypes)
	const daysOfMonth = _.range(1,31);

	React.useEffect(() => {
		console.log(p.lap("startign async call"));
		activeYears.map(y => getWrapper(y).send())
		Promise.all(activeYears.map(y => getWrapper(y).send())).then((yearsResults) => {
			console.log(p.lap("finished async call"));
			const data = yearsResults.map(result => {
				if (result.type == "Success") return result.success;
				else return null;
			}).filter(Boolean);

			if (data.length == yearsResults.length) {
				const dataHash = data.reduce((agg, result, i) => {
					const year = activeYears[i];
					agg[year] = result.map(mapSalesRecord);
					return agg;
				}, {} as SalesState);	

				setSales(dataHash);
				setReady(true)
			}
		})
	}, [activeYears]);

	const getIncrementalSeries: (showPrice: boolean) => [string, number[]][] = 
	(showPrice) => [sales[2022], sales[2021], sales[2020]].map(salesRecords => {
		console.log(p.lap("starting incremental chart calc"));
		const yearNumeral = salesRecords[0].purchaseDate.getOrElse(null).format("YYYY");
		const series = daysOfMonth.map(dayNumeral => {
			const dayMoment = moment(`${month}/${padWithZero(String(dayNumeral))}/${yearNumeral}`, "MM/DD/YYYY",true);
			return (
				dayMoment.isValid()
				? salesRecords
					.filter(rec => rec.voidCloseId.isNone() && rec.purchaseDate.map(d => d.isSame(dayMoment, 'day')).getOrElse(false))
					.filter(rec => activeMembershipTypes == null || activeMembershipTypes[rec.membershipTypeId])
					.reduce((sum, rec) => sum + (showPrice ? rec.price : 1), 0)
				: null
			);
		});
		console.log(p.lap("finished incremental chart calc"));
		return [yearNumeral, series] as [string, number[]];
	});

	const getCumulativeSeries: (showPrice: boolean) => [string, number[]][] = 
	(showPrice) => [sales[2022], sales[2021], sales[2020]].map(salesRecords => {
		console.log(p.lap("starting cumulative chart calc"));
		const yearNumeral = salesRecords[0].purchaseDate.getOrElse(null).format("YYYY");
		const series = daysOfMonth.map(dayNumeral => {
			const dayMoment = moment(`${month}/${padWithZero(String(dayNumeral))}/${yearNumeral}`, "MM/DD/YYYY",true);
			return (
				dayMoment.isValid()
				? salesRecords
					.filter(rec => rec.voidCloseId.isNone() && rec.purchaseDate.map(d => d.isSameOrBefore(dayMoment, 'day')).getOrElse(false))
					.reduce((sum, rec) => sum + (showPrice ? rec.price : 1), 0)
				: null
			);
		});
		console.log(p.lap("finished cumulative chart calc"));
		return [yearNumeral, series] as [string, number[]];
	});

	const getOptions: (title: string, series: [string, number[]][]) => Highcharts.Options = (title, series) => ({
		title: {
			text: title
		},
		subtitle: {
			text: "Mems on purchase date, voided mems excluded"
		},
		yAxis: {
			title: {
				text: title
			}
		},
		xAxis: {
			title: {
				text: "Mem purchase Date"
			},
			categories: daysOfMonth.map(d => Number(month) + "/" + d)
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle'
		},
		plotOptions: {
			series: {
				label: {
					connectorAllowed: false
				},
				pointStart: 0
			}
		},
		series: series.map((s, i) => ({
			name: s[0],
			data: s[1],
			visible: i <= 1
		})) as Highcharts.SeriesOptionsType[],
		responsive: {
			rules: [{
				condition: {
					maxWidth: 500
				},
				chartOptions: {
					legend: {
						layout: 'horizontal',
						align: 'center',
						verticalAlign: 'bottom'
					}
				}
			}]
		},
		credits: {
			enabled: false
		},
	});

	if (ready) {
		console.log(p.lap("starting calc ret"));
		const ret = <Container fluid className="p-0">
			<Row>
				<Col className="col-md-6">
					<Card>
						<CardHeader>
							<CardTitle tag="h5" className="mb-0">Filter</CardTitle>
						</CardHeader>
						<CardBody>
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
											onChange={e => {
												const options = (e.target as unknown as HTMLSelectElement).options
												const selectedOptions = arrayifyCollection(options).filter(o => o.selected).map(o => Number(o.value))
												setActiveYears(selectedOptions)
											}}
										>
											<option>2022</option>
											<option>2021</option>
											<option>2020</option>
										</CustomInput>
									</Col>
								</FormGroup>
							</Form>
							
						</CardBody>
					</Card>
				</Col>
				<Col className="col-md-6">
					<Card>
						<CardHeader>
							<CardTitle tag="h5" className="mb-0">Filter</CardTitle>
						</CardHeader>
						<CardBody>
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
											onChange={e => {
												const options = (e.target as unknown as HTMLSelectElement).options
												const selectedOptions = arrayifyCollection(options).filter(o => o.selected).map(o => Number(o.value))
												setActiveMembershipTypes(hashifyArray(selectedOptions))
											}}
										>
											<option>1</option>
											<option>10</option>
										</CustomInput>
									</Col>
								</FormGroup>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<Row>
				<div style={{width: "100%"}}>
					<HighchartsReact highcharts={Highcharts} options={getOptions("Daily Sales #", getIncrementalSeries(false))} />
					<br /><br /><br />
					<HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales #", getCumulativeSeries(false))} />
					<br /><br /><br />
					<HighchartsReact highcharts={Highcharts} options={getOptions("Daily Sales $", getIncrementalSeries(true))} />
					<br /><br /><br />
					<HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales $", getCumulativeSeries(true))} />
				</div>
			</Row>
		</Container>;
		console.log(p.lap("finished calc ret"));
		return ret;
	} else {
		return <span>"Loading..."</span>
	}
}