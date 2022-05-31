import * as React from 'react';
import * as t from "io-ts";
import { PageName } from 'pages/pageNames';
import { pathDockReport } from '@app/paths';
import RouteWrapper from '@core/RouteWrapper';
import PageWrapper from '@core/PageWrapper';
import { Loader } from 'react-feather';
import { DockReportPage } from 'pages/dockhouse/dock-report';
import { dockReportValidator, getDockReport } from '@async/rest/dock-report';
import { toMomentFromLocalDate, toMomentFromLocalDateTime } from '@util/dateUtil';

export const routeDockReportPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathDockReport,
	sidebarTitle: "Dock Report",
	pageName: PageName.DOCK_REPORT,
}, history => <PageWrapper
	key="dockrpt"
	history={history}
	component={(urlProps: {}, async: t.TypeOf<typeof dockReportValidator>) => <DockReportPage
		dockReportInitState={async}
	/>}
	urlProps={{}}
	getAsyncProps={() => {
		return getDockReport.send(null)
	}}
	shadowComponent={<Loader />}
/>);
