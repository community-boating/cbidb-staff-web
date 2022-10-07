import RouteWrapper from 'core/RouteWrapper';
import PageWrapper from 'core/PageWrapper';
import * as React from 'react';
import { reportingBasePath } from './_base';
import { PageName } from 'pages/pageNames';
import Loader from 'components/Loader';
import {getWrapper, mapSalesRecord, SalesRecord} from "async/rest/membership-sale"
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
	component={(urlProps: {}) => <SalesDashboardPage />}
	urlProps={{}}
	shadowComponent={<Loader />}
/>);
