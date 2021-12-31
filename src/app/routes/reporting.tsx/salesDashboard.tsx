import RouteWrapper from '@core/RouteWrapper';
import PageWrapper from '@core/PageWrapper';
import * as React from 'react';
import { reportingBasePath } from './_base';
import { PageName } from 'pages/pageNames';
import Loader from '@components/Loader';
import {getWrapper, mapSalesRecord, SalesRecord} from "@async/rest/membership-sale"
import { SalesDashboardPage } from 'pages/reporting/SalesDashboardPage';

export const salesDashboardPath = reportingBasePath.appendPathSegment("dashboard");

export const salesDashboardPageRoute = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: salesDashboardPath,
	sidebarTitle: "Sales Dashboard",
	pageName: PageName.SALES_DASHBOARD,
	requireSudo: true,
}, history => <PageWrapper
	key="sales dashboard"
	history={history}
	component={(urlProps: {}, async: {
		"2021": SalesRecord[], "2020": SalesRecord[], "2019": SalesRecord[], "2018": SalesRecord[], "2017": SalesRecord[]
	}) => <SalesDashboardPage sales={async} />}
	urlProps={{}}
	getAsyncProps={() => {
		return Promise.all([
			getWrapper(2021).send(null),
			getWrapper(2020).send(null),
			getWrapper(2019).send(null),
			getWrapper(2018).send(null),
			getWrapper(2017).send(null),
		]).then(([a, b, c, d, e]) => {
			if (a.type == "Success" && b.type == "Success" && c.type == "Success" && d.type == "Success" && e.type == "Success") {
				return Promise.resolve({
					type: "Success",
					success: {
						"2021": a.success.map(mapSalesRecord),
						"2020": b.success.map(mapSalesRecord),
						"2019": c.success.map(mapSalesRecord),
						"2018": d.success.map(mapSalesRecord),
						"2017": e.success.map(mapSalesRecord),
					}
				})
			} else return null;
		})
	}}
	shadowComponent={<Loader />}
/>);
