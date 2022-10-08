import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as moment from 'moment';
import * as _ from 'lodash';

import {SalesRecord, getWrapper, mapSalesRecord} from "async/rest/membership-sale"
import { padWithZero } from 'util/dateUtil';
import { Profiler } from 'util/profiler';
import { addSales, initSalesCache } from './SalesDataCache';

export type ActiveMembershipTypes = {
	[K: number]: true
}

export const SalesDasboard = (props: {
	activeYears: number[],
	month: number,
	activeMembershipTypes: ActiveMembershipTypes,
	setFinished: () => void
}) => {
	const {activeYears, month, activeMembershipTypes, setFinished} = props
	const p = new Profiler();
	const [sales, setSales] = React.useState(initSalesCache())
	const [ready, setReady] = React.useState(false)
	const daysOfMonth = _.range(1,31);
	const months = _.range(1,12);

	React.useEffect(() => {
		console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&NEW DASHBOARD")
	}, [])

	React.useEffect(() => {
		console.log(p.lap("startign async call"));
		console.log(activeYears)
		activeYears.map(y => getWrapper(y).send())
		Promise.all(activeYears.map(y => getWrapper(y).send())).then((yearsResults) => {
			console.log(p.lap("finished async call"));
			const data = yearsResults.map(result => {
				if (result.type == "Success") return result.success;
				else return null;
			}).filter(Boolean);

			if (data.length == yearsResults.length) {
				setSales(data.reduce((newSales, year) => {
					return addSales(newSales, year.map(mapSalesRecord));
				}, sales));
				console.log(p.lap("processed sales data"));
				setReady(true)
				setFinished();
				console.log("READY")
			} else {
				setReady(true)
				setFinished();
				console.log("READY ERROR")
			}
		})
	}, [activeYears.join("$")]);

	function getSeries(isCumulative: boolean) {
		console.log(sales)
		const series = activeYears.map(year => {
			const yearCache = sales[year] || initSalesCache();
			const totals = daysOfMonth.map(day => {
				const monthCache = yearCache[month] || initSalesCache();
				const dayCache = monthCache[day] || initSalesCache();
				return dayCache.total;
			});
			if (isCumulative) {
				const priorMonthsCumulative = months.filter(m => m < month).reduce((agg, m) => {
					const monthCache = yearCache[m] || initSalesCache();
					return {
						count: agg.count + monthCache.total.count,
						value: agg.value + monthCache.total.value
					};
				}, initSalesCache().total);
				const totalsCumulative = totals.map((e, i, arr) => {
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
					counts: [String(year), totals.map(t => t.count)] as [string, number[]],
					values: [String(year), totals.map(t => t.value)] as [string, number[]]
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

	// const getIncrementalSeries: (showPrice: boolean) => [string, number[]][] = 
	// (showPrice) => sales.map(salesRecords => {
	// 	console.log(p.lap("starting incremental chart calc"));
	// 	const yearNumeral = salesRecords[0].purchaseDate.getOrElse(null).format("YYYY");
	// 	const series = daysOfMonth.map(dayNumeral => {
	// 		const dayMoment = moment(`${month}/${padWithZero(String(dayNumeral))}/${yearNumeral}`, "MM/DD/YYYY",true);
	// 		return (
	// 			dayMoment.isValid()
	// 			? salesRecords
	// 				.filter(rec => rec.voidCloseId.isNone() && rec.purchaseDate.map(d => d.isSame(dayMoment, 'day')).getOrElse(false))
	// 				.filter(rec => activeMembershipTypes == null || activeMembershipTypes[rec.membershipTypeId])
	// 				.reduce((sum, rec) => sum + (showPrice ? rec.price : 1), 0)
	// 			: null
	// 		);
	// 	});
	// 	console.log(p.lap("finished incremental chart calc"));
	// 	return [yearNumeral, series] as [string, number[]];
	// });

	// const getCumulativeSeries: (showPrice: boolean) => [string, number[]][] = 
	// (showPrice) => sales.map(salesRecords => {
	// 	console.log(p.lap("starting cumulative chart calc"));
	// 	const yearNumeral = salesRecords[0].purchaseDate.getOrElse(null).format("YYYY");
	// 	const series = daysOfMonth.map(dayNumeral => {
	// 		const dayMoment = moment(`${month}/${padWithZero(String(dayNumeral))}/${yearNumeral}`, "MM/DD/YYYY",true);
	// 		return (
	// 			dayMoment.isValid()
	// 			? salesRecords
	// 				.filter(rec => rec.voidCloseId.isNone() && rec.purchaseDate.map(d => d.isSameOrBefore(dayMoment, 'day')).getOrElse(false))
	// 				.reduce((sum, rec) => sum + (showPrice ? rec.price : 1), 0)
	// 			: null
	// 		);
	// 	});
	// 	console.log(p.lap("finished cumulative chart calc"));
	// 	return [yearNumeral, series] as [string, number[]];
	// });

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
			// visible: i <= 1
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
		return <div style={{width: "100%"}}>
			<HighchartsReact highcharts={Highcharts} options={getOptions("Daily Sales #", incrementalSeries.counts)} />
			<br /><br />
			<HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales #", cumulativeSeries.counts)} />
			<br /><br />
			<HighchartsReact highcharts={Highcharts} options={getOptions("Daily Sales $", incrementalSeries.values)} />
			<br /><br />
			<HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales $", cumulativeSeries.values)} />
		</div>;
	} else {
		return <span>Loading....</span>
	}
}