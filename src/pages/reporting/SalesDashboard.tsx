import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as moment from 'moment';
import * as _ from 'lodash';

import {SalesRecord, getWrapper, mapSalesRecord} from "async/rest/membership-sale"
import { padWithZero } from 'util/dateUtil';
import { Profiler } from 'util/profiler';
import { addSales, initSalesCache, SalesCache } from './SalesDataCache';
import { Card, CardBody } from 'reactstrap';

export type ActiveMembershipTypes = {
	[K: number]: true
}

export const SalesDasboard = (props: {
	activeYears: number[],
	month: number,
	activeMembershipTypes: ActiveMembershipTypes,
	setReady: () => void
	setNotReady: () => void
}) => {
	const {activeYears, month, activeMembershipTypes, setReady, setNotReady} = props
	const nowYear = Number(moment().format("YYYY"))
	const p = new Profiler();
	const [sales, setSales] = React.useState(initSalesCache())
	const daysOfMonth = _.range(1,31);
	const months = _.range(1,12);
	const [counter, setCounter] = React.useState(0)

	React.useEffect(() => {
		const neededYears = activeYears.filter(y => sales[y] == undefined);
		if (neededYears.length == 0) return;
		setNotReady();
		Promise.all(neededYears.map(y => getWrapper(y).send())).then((yearsResults) => {
			console.log(p.lap("finished async call"));
			const data = yearsResults.map(result => {
				if (result.type == "Success") return result.success;
				else return null;
			}).filter(Boolean);

			if (data.length == yearsResults.length) {
				setSales(data.reduce((newSales, year, i) => {
					return addSales(neededYears[i], newSales, year.map(mapSalesRecord));
				}, sales));
				console.log(p.lap("processed sales data"));
				setReady()
				console.log("READY")
				setCounter((counter+1)%5)
			} else {
				setReady()
				console.log("READY ERROR")
			}
		})
	}, [activeYears.join("$")]);

	function getSeries(isCumulative: boolean) {
		const types = Object.keys(activeMembershipTypes)
		const series = activeYears.map(year => {
			const yearCache = sales[year] || initSalesCache();
			const dayTotals = daysOfMonth.map(day => {
				const monthCache = yearCache[month] || initSalesCache();
				const dayCache = monthCache[day] || initSalesCache();
				if (types.length > 0) {
					return types.reduce((agg, id) => {
						const idCache = dayCache[id] || initSalesCache();
						return {
							count: agg.count + idCache.total.count,
							value: agg.value + idCache.total.value
						}
					}, initSalesCache().total)
				} else {
					return dayCache.total;
				}
			});
			if (isCumulative) {
				const priorMonthsCumulative = months.filter(m => m < month).reduce((agg, m) => {
					const monthCache = yearCache[m] || initSalesCache();
					if (types.length > 0) {
						const monthIncludedTotal = Object.keys(monthCache).filter(k => k != "total").reduce((agg, day) => {
							const dayTotal = types.reduce((agg, id) => {
								const idCache = monthCache[day][id] || initSalesCache();
								return {
									count: agg.count + idCache.total.count,
									value: agg.value + idCache.total.value
								}
							}, initSalesCache().total)
							return {
								count: agg.count + dayTotal.count,
								value: agg.value + dayTotal.value,
							}
						}, initSalesCache().total);
						return {
							count: agg.count + monthIncludedTotal.count,
							value: agg.value + monthIncludedTotal.value
						};
					} else {
						return {
							count: agg.count + monthCache.total.count,
							value: agg.value + monthCache.total.value
						};
					}
				}, initSalesCache().total);
				const totalsCumulative = dayTotals.map((e, i, arr) => {
					return arr.filter((ee, ii) => ii <= i).reduce((total, ee) => {
						return {
							count: total.count + ee.count,
							value: total.value + ee.value
						}
					}, priorMonthsCumulative)
				});
				return {
					counts: [String(year), totalsCumulative.map(t => t.count)] as [string, number[]],
					values: [String(year), totalsCumulative.map(t => t.value)] as [string, number[]]
				};
			} else {
				return {
					counts: [String(year), dayTotals.map(t => t.count)] as [string, number[]],
					values: [String(year), dayTotals.map(t => t.value)] as [string, number[]]
				};
			}
		});
		return {
			counts: series.map(s => s.counts),
			values: series.map(s => s.values)
		}
	}

	const incrementalSeries =  React.useMemo(() => getSeries(false), [activeYears, sales])

	const cumulativeSeries = React.useMemo(() => getSeries(true), [activeYears, sales])

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
			colorIndex: (nowYear-Number(s[0])) % 10
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


	const charts = React.useMemo(() => {
		return <div id="dashboard-container" style={{width: "100%"}}>
			<Card><CardBody><HighchartsReact highcharts={Highcharts} options={getOptions("Daily Sales #", incrementalSeries.counts)} /></CardBody></Card>
			<Card><CardBody><HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales #", cumulativeSeries.counts)} /></CardBody></Card>
			<Card><CardBody><HighchartsReact highcharts={Highcharts} options={getOptions("Daily Sales $", incrementalSeries.values)} /></CardBody></Card>
			<Card><CardBody><HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales $", cumulativeSeries.values)} /></CardBody></Card>
		</div>
	}, [activeYears, month, activeMembershipTypes, counter])

	return <>{charts}</>;
}