import * as React from 'react';
import * as t from 'io-ts';
import RouteWrapper from 'core/RouteWrapper';
import PageWrapper from 'core/PageWrapper';
import Loader from 'components/Loader';
import {getWrapper, apClassInstanceValidator, ApClassInstance} from "async/rest/ap-class-instances"
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
	component={(urlProps: {}, instances: ApClassInstance[]) => <ApClassCalendarPage
		instances={instances}
	/>}
	urlProps={{}}
	getAsyncProps={() => {
		return getWrapper.send()
	}}
	shadowComponent={<Loader />}
/>);
