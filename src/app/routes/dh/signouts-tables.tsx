import * as React from 'react';
import * as t from "io-ts";
import { PageName } from 'pages/pageNames';
import { pathSignoutsTables } from 'app/paths';
import RouteWrapper from 'core/RouteWrapper';
import PageWrapper from 'core/PageWrapper';
import { Loader } from 'react-feather';
import { SignoutsTablesPage } from 'pages/dockhouse/signouts/SignoutsTablesPage';
import { signoutsValidator, getSignoutsToday } from 'async/staff/dockhouse/signouts-tables';
export const routeSignoutsTablesPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathSignoutsTables,
	navTitle: "Signouts Tables",
	pageName: PageName.SIGNOUTS_TABLES,
}, history => <PageWrapper
	autoRefresh={10000}
	key="signoutstables"
	history={history}
	component={(urlProps: {}, async: t.TypeOf<typeof signoutsValidator>) => <SignoutsTablesPage
		initState={async}
	/>}
	urlProps={{}}
	getAsyncProps = {(urlProps, asc) => {
		return getSignoutsToday.send(asc)
	}}
	shadowComponent={<Loader />}
/>);
