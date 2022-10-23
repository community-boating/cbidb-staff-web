import * as React from 'react';
import * as t from 'io-ts';
import RouteWrapper from 'core/RouteWrapper';
import PageWrapper from 'core/PageWrapper';
import Loader from 'components/Loader';
import {apiw as getSignups, validator} from "async/staff/all-jp-signups"
import { PageName } from 'pages/pageNames';
import { pathJpClasses } from 'app/paths';
import { ApClassCalendarPage } from 'pages/adultProgram/ApClassCalendarPage';

export const routeApClassesPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathJpClasses,
	sidebarTitle: "AP Classes",
	pageName: PageName.AP_CLASSES,
}, history => <PageWrapper
	key="apclasses"
	history={history}
	component={(urlProps: {}, {}: t.TypeOf<typeof validator>) => <ApClassCalendarPage

	/>}
	urlProps={{}}
	// getAsyncProps={() => {
	// 	return getSignups.send()
	// }}
	shadowComponent={<Loader />}
/>);
