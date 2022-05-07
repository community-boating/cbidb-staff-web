import * as React from 'react';
import {apiw as getSignups, validator} from "@async/staff/all-jp-signups"
import { PageName } from 'pages/pageNames';
import { pathDockReport } from '@app/paths';
import RouteWrapper from '@core/RouteWrapper';
import PageWrapper from '@core/PageWrapper';
import { Loader } from 'react-feather';
import { DockReportPage } from 'pages/dockhouse/dock-report';

export const routeDockReportPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathDockReport,
	sidebarTitle: "Dock Report",
	pageName: PageName.JP_CLASSES,
}, history => <PageWrapper
	key="dockrpt"
	history={history}
	component={(urlProps: {}) => <DockReportPage

	/>}
	urlProps={{}}
	shadowComponent={<Loader />}
/>);
