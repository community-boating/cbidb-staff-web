import * as React from 'react';
import * as t from "io-ts";
import { PageName } from 'pages/pageNames';
import { pathIncidents } from 'app/paths';
import RouteWrapper from 'core/RouteWrapper';
import PageWrapper from 'core/PageWrapper';
import { Loader } from 'react-feather';
import { SignoutsTablesPage } from 'pages/dockhouse/signouts/SignoutsTablesPage';
import { signoutsValidator, getSignoutsToday } from 'async/staff/dockhouse/signouts';
import IncidentsPage from 'pages/dockhouse/incidents/IncidentsPage';
export const routeIncidentsPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathIncidents,
	navTitle: "Incidents",
	pageName: PageName.INCIDENTS,
}, history => <PageWrapper
	autoRefresh={10000}
	key="incidents"
	history={history}
	component={(urlProps: {}, async) => <IncidentsPage
	/>}
	urlProps={{}}
	shadowComponent={<Loader />}
/>);
