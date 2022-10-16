import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as moment from 'moment';
import * as _ from 'lodash';

import {getWrapper, mapSalesRecord, SalesRecord} from "async/rest/membership-sale"
import { Profiler } from 'util/profiler';
import { initSalesCache, evaluateTree, addSale, AggregateUnit, GenericSalesCache } from './SalesDataCache';
import { Card, CardBody, Col, Row } from 'reactstrap';
import months from 'models/months';
import { padWithZero } from 'util/dateUtil';

export type ActiveMembershipTypes = {
	[K: number]: true
}

type SalesSearchKey = {
	[K in keyof SalesCacheKey]: string[]
}

///////////////////////////////////////////////////
// THINGS TO CHANGE IF THE TREE STRUCTURE CHANGES

type SalesCacheKey = {
	year?: string,
	month?: string,
	day?: string,
	membershipTypeId?: string,
	discountInstanceId?: string,
	unitPrice?: string
}

const PRICE_INDEX = 5;

function searchKeyToSearchArray(c: SalesSearchKey): string[][] {
	const ret = [
		c.year,
		c.month,
		c.day,
		c.membershipTypeId,
		c.discountInstanceId,
		c.unitPrice
	];
	return (_.dropWhile(ret, e => e === undefined)).map(e => e || []);
}

const saleToCacheKeyList: (doVoid: boolean, closedDate: boolean) => (s: SalesRecord) => string[] = (doVoid, closedDate) => s => {
	const dateToUse = (
		doVoid
		? ( closedDate ? s.voidClosedDatetime : s.voidClosedDatetime.chain(() => s.purchaseDate))
		: ( closedDate ? s.saleClosedDatetime : s.purchaseDate )
	);

	return dateToUse.map(d => ({
		year: d.format("YYYY"),
		month: String(Number(d.format("MM"))),
		day: d.format("DD"),
		membershipTypeId: String(s.membershipTypeId),
		discountInstanceId: String(s.discountInstanceId.getOrElse(-1)),
		unitPrice: String((doVoid ? -1 : 1) * s.price)
	})).map(c => [
		c.year,
		c.month,
		c.day,
		c.membershipTypeId,
		c.discountInstanceId,
		c.unitPrice])
	.getOrElse(null)
}

function combineTrees(a: GenericSalesCache, b: GenericSalesCache, keys): AggregateUnit {
	const aResult = evaluateTree(a, keys);
	const bResult = evaluateTree(b, keys);
	return {
		count: aResult.count + bResult.count,
		value: aResult.value + bResult.value
	}
}

////////////////////////////////////////////////////////////////

export const SalesDasboard = (props: {
	activeYears: number[],
	month: number,
	activeMembershipTypes: ActiveMembershipTypes,
	useClosedDate: boolean
	voidByErase: boolean
	bySeason: boolean
	setReady: () => void
	setNotReady: () => void
}) => {
	const {activeYears, month, activeMembershipTypes, setReady, setNotReady, useClosedDate, voidByErase, bySeason} = props
	const nowYear = Number(moment().format("YYYY"))
	const p = new Profiler();
	const [sales, setSales] = React.useState({
		salesByPurchaseDate: initSalesCache(),
		salesByClosedDate: initSalesCache(),
		voidsByPurchaseDate: initSalesCache(),
		voidsByClosedDate: initSalesCache()
	})
	const daysOfMonth = _.range(1,32);
	const [counter, setCounter] = React.useState(0);  // just a value to poke to make the dashboard reload

	function getNeededYearsPreCacheCheck() {
		if (bySeason) {
			const hashedYears = activeYears.reduce((agg, year) => {
				agg[year] = true;
				agg[year-1] = true;
				return agg;
			}, {} as {[K: number]: true})
			return Object.keys(hashedYears).map(Number).sort().reverse();
		} else {
			return activeYears;
		}
	}

	const monthsToUse = (
		bySeason
		? months.filter(m => m.key > 10).concat(months.filter(m => m.key <= 10))
		: months
	)

	React.useEffect(() => {
		const neededYears = getNeededYearsPreCacheCheck().filter(y => sales.salesByPurchaseDate.values[y] == undefined);
		if (neededYears.length == 0) return;
		setNotReady();
		Promise.all(neededYears.map(y => getWrapper(y).send())).then((yearsResults) => {
			console.log(p.lap("finished async call"));
			const data = yearsResults.map(result => {
				if (result.type == "Success") return result.success;
				else return null;
			}).filter(Boolean);

			if (data.length == yearsResults.length) {
				const mappedData = data.map(year => year.map(mapSalesRecord));
				const addMappedData = (start: GenericSalesCache, doVoid: boolean, closedDate: boolean) => mappedData.reduce((newSales, year) => {
					return year
					.map(s => saleToCacheKeyList(doVoid, closedDate)(s))
					.filter(Boolean)
					.reduce((newCache, s) => {
						return addSale(newCache, s, (doVoid ? -1 : 1), Number(s[PRICE_INDEX]))
					}, newSales);
				}, start);
				const newSales = {
					salesByPurchaseDate: addMappedData(sales.salesByPurchaseDate, false, false),
					salesByClosedDate: addMappedData(sales.salesByClosedDate, false, true),
					voidsByPurchaseDate: addMappedData(sales.voidsByPurchaseDate, true, false),
					voidsByClosedDate: addMappedData(sales.voidsByClosedDate, true, true),
				};
				setSales(newSales);
				console.log(p.lap("processed sales data"));
				setReady()
				console.log("READY")
				setCounter((counter+1)%5)
			} else {
				setReady()
				console.log("READY ERROR")
			}
		})
	}, [activeYears.join("$"), bySeason]);

	function getSeries(isCumulative: boolean) {
		const types = Object.keys(activeMembershipTypes)
		const salesTree = ( useClosedDate ? sales.salesByClosedDate : sales.salesByPurchaseDate);
		const voidTree = ( voidByErase ? sales.voidsByPurchaseDate : sales.voidsByClosedDate);

		const seriesSuffix = bySeason ? " SEASON" : "";

		console.log("%%%", sales.salesByClosedDate.values["2021"].values["11"])

		const series = activeYears.map(year => {
			const pointTotals = (
				month == -1
				? monthsToUse.map(m => {
					return combineTrees(salesTree, voidTree, searchKeyToSearchArray({
						year: [(bySeason && m.key>10) ? String(year-1) : String(year)],
						month: [String(m.key)],
						membershipTypeId: types
					}));
				})
				: daysOfMonth.map(day => {
					return combineTrees(salesTree, voidTree, searchKeyToSearchArray({
						year: [(bySeason && month>10) ? String(year-1) : String(year)],
						month: [String(month)],
						day: [padWithZero(String(day))],
						membershipTypeId: types
					}));
				})
			);

			if (isCumulative) {
				const priorMonthsCumulative = (function() {
					const priorMonths = (
						bySeason
						? monthsToUse.map(m => m.key).filter(m => ((m + 2) % 13) < ((month+2) % 13)).map(String)
						: months.map(m => m.key).filter(m => m < month).map(String)
					);
					console.log(monthsToUse)
					console.log(priorMonths)

					if (bySeason && priorMonths.length < 3 && priorMonths.length > 0) {
						return combineTrees(salesTree, voidTree, searchKeyToSearchArray({
							year: [String(year-1)],
							month: priorMonths,
							membershipTypeId: types
						}));
					} else if (bySeason && priorMonths.length > 0) {
						const priorYear = combineTrees(salesTree, voidTree, searchKeyToSearchArray({
							year: [String(year-1)],
							month: priorMonths.slice(0,2),
							membershipTypeId: types
						}));
						const thisYear = combineTrees(salesTree, voidTree, searchKeyToSearchArray({
							year: [String(year)],
							month: priorMonths.slice(2),
							membershipTypeId: types
						}));
						return {
							count: priorYear.count + thisYear.count,
							value: priorYear.value + thisYear.value
						}
					} else if (priorMonths.length > 0) {
						return combineTrees(salesTree, voidTree, searchKeyToSearchArray({
							year: [String(year)],
							month: priorMonths,
							membershipTypeId: types
						}));
					} else {
						return initSalesCache().total;
					}
				}());

				const totalsCumulative = pointTotals.map((e, i, arr) => {
					return arr.filter((ee, ii) => ii <= i).reduce((total, ee) => {
						return {
							count: total.count + ee.count,
							value: total.value + ee.value
						}
					}, priorMonthsCumulative)
				});
				return {
					counts: [String(year)+seriesSuffix, totalsCumulative.map(t => t.count)] as [string, number[]],
					values: [String(year)+seriesSuffix, totalsCumulative.map(t => t.value)] as [string, number[]]
				};
			} else {
				return {
					counts: [String(year)+seriesSuffix, pointTotals.map(t => t.count)] as [string, number[]],
					values: [String(year)+seriesSuffix, pointTotals.map(t => t.value)] as [string, number[]]
				};
			}
		});
		return {
			counts: series.map(s => s.counts),
			values: series.map(s => s.values)
		}
	}

	const incrementalSeries =  React.useMemo(() => getSeries(false), [activeYears, sales, useClosedDate, voidByErase, bySeason])

	const cumulativeSeries = React.useMemo(() => getSeries(true), [activeYears, sales, useClosedDate, voidByErase, bySeason])

	const getOptions: (title: string, series: [string, number[]][]) => Highcharts.Options = (title, series) => ({
		title: {
			text: title
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
			categories: (month == -1) ? monthsToUse.map(m => m.name): daysOfMonth.map(d => Number(month) + "/" + d)
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
			colorIndex: (nowYear-Number(s[0].substring(0,4))) % 10
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

	const descriptor = (month == -1) ? "Monthly" : "Daily"

	const charts = React.useMemo(() => {
		if (month == -1) {
			return <div id="dashboard-container" style={{width: "100%"}}>
				<Row>
					<Col>
						<Card><CardBody><HighchartsReact highcharts={Highcharts} options={getOptions(descriptor + " Sales #", incrementalSeries.counts)} /></CardBody></Card>
					</Col>
					<Col>
						<Card><CardBody><HighchartsReact highcharts={Highcharts} options={getOptions(descriptor + " Sales $", incrementalSeries.values)} /></CardBody></Card>
					</Col>
				</Row>
				<Row>
					<Col>
						<Card><CardBody><HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales #", cumulativeSeries.counts)} /></CardBody></Card>
					</Col>
					<Col>
						<Card><CardBody><HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales $", cumulativeSeries.values)} /></CardBody></Card>
					</Col>
				</Row>
			</div>;
		} else {
			return <div id="dashboard-container" style={{width: "100%"}}>
				<Card><CardBody><HighchartsReact highcharts={Highcharts} options={getOptions(descriptor + " Sales #", incrementalSeries.counts)} /></CardBody></Card>
				<Card><CardBody><HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales #", cumulativeSeries.counts)} /></CardBody></Card>
				<Card><CardBody><HighchartsReact highcharts={Highcharts} options={getOptions(descriptor + " Sales $", incrementalSeries.values)} /></CardBody></Card>
				<Card><CardBody><HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales $", cumulativeSeries.values)} /></CardBody></Card>
			</div>;
		}
	}, [activeYears, month, activeMembershipTypes, counter, useClosedDate, voidByErase, bySeason])

	return <>{charts}</>;
}
