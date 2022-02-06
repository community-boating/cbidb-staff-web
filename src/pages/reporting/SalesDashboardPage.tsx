import * as React from 'react';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';
import * as moment from 'moment';
import HighchartsReact from 'highcharts-react-official';

import {SalesRecord} from "@async/rest/membership-sale"
import { padWithZero } from '@util/dateUtil';

export const SalesDashboardPage = (props: {sales: {
	"2021": SalesRecord[], "2020": SalesRecord[], "2019": SalesRecord[], "2018": SalesRecord[], "2017": SalesRecord[]
}}) => {
	const month = "02";
	const daysOfMonth = _.range(1,31);

	const getIncrementalSeries: (showPrice: boolean) => [string, number[]][] = 
	(showPrice) => [props.sales[2021], props.sales[2020], props.sales[2019], props.sales[2018]].map(salesRecords => {
		const yearNumeral = salesRecords[0].purchaseDate.getOrElse(null).format("YYYY");
		const series = daysOfMonth.map(dayNumeral => {
			const dayMoment = moment(`${month}/${padWithZero(String(dayNumeral))}/${yearNumeral}`, "MM/DD/YYYY",true);
			return (
				dayMoment.isValid()
				? salesRecords
					.filter(rec => rec.voidCloseId.isNone() && rec.purchaseDate.map(d => d.isSame(dayMoment, 'day')).getOrElse(false))
					.reduce((sum, rec) => sum + (showPrice ? rec.price : 1), 0)
				: null
			);
		});
		return [yearNumeral, series] as [string, number[]];
	});

	const getCumulativeSeries: (showPrice: boolean) => [string, number[]][] = 
	(showPrice) => [props.sales[2021], props.sales[2020], props.sales[2019], props.sales[2018]].map(salesRecords => {
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
		series: series.map(s => ({
			name: s[0],
			data: s[1]
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

	return <div>
		<HighchartsReact highcharts={Highcharts} options={getOptions("Daily Sales #", getIncrementalSeries(false))} />
		<br /><br /><br />
		<HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales #", getCumulativeSeries(false))} />
		<br /><br /><br />
		<HighchartsReact highcharts={Highcharts} options={getOptions("Daily Sales $", getIncrementalSeries(true))} />
		<br /><br /><br />
		<HighchartsReact highcharts={Highcharts} options={getOptions("Cumulative Sales $", getCumulativeSeries(true))} />
	</div>;
}