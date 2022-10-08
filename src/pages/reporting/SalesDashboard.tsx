import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as moment from 'moment';
import * as _ from 'lodash';

import {SalesRecord, getWrapper, mapSalesRecord} from "async/rest/membership-sale"
import { padWithZero } from 'util/dateUtil';
import { Profiler } from 'util/profiler';

export type ActiveMembershipTypes = {
	[K: number]: true
}

export const SalesDasboard = (props: {
	activeYears: number[],
	month: number,
	activeMembershipTypes: ActiveMembershipTypes,
	setFinished: () => void
}) => {
	console.log(props)
	const {activeYears, month, activeMembershipTypes, setFinished} = props
	const p = new Profiler();

	const [sales, setSales] = React.useState([] as SalesRecord[][]);
	const [ready, setReady] = React.useState(false)
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
				setSales(data.map(year => year.map(mapSalesRecord)));
				setReady(true)
				setFinished();
				console.log("READY")
			} else {
				setReady(true)
				setFinished();
				console.log("READY ERROR")
			}
		})
	}, [activeYears]);

	console.log(sales)

	const getIncrementalSeries: (showPrice: boolean) => [string, number[]][] = 
	(showPrice) => sales.map(salesRecords => {
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
	(showPrice) => sales.map(salesRecords => {
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
		return <div style={{width: "100%"}}>
			<HighchartsReact highcharts={Highcharts} options={getOptions("Daily Sales #", getIncrementalSeries(false))} />
			<br /><br /><br />
			<HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales #", getCumulativeSeries(false))} />
			<br /><br /><br />
			<HighchartsReact highcharts={Highcharts} options={getOptions("Daily Sales $", getIncrementalSeries(true))} />
			<br /><br /><br />
			<HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales $", getCumulativeSeries(true))} />
		</div>;
	} else {
		return <span>Loading....</span>
	}
}