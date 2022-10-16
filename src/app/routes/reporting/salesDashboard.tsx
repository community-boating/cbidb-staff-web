import RouteWrapper from 'core/RouteWrapper';
import PageWrapper from 'core/PageWrapper';
import * as React from 'react';
import { reportingBasePath } from './_base';
import { PageName } from 'pages/pageNames';
import Loader from 'components/Loader';
import { SalesDashboardPage } from 'pages/reporting/SalesDashboardPage';
import {getWrapper, MembershipType} from "async/rest/membership-types"

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
	component={(urlProps: {}, types: MembershipType[]) => <SalesDashboardPage membershipTypes={types} />}
	urlProps={{}}
	getAsyncProps={() => {
		return getWrapper.send()
	}}
	shadowComponent={<Loader />}
/>);
