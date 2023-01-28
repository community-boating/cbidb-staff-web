import * as React from 'react';
import { PageName } from 'pages/pageNames';
import { pathClasses } from 'app/paths';
import RouteWrapper from 'core/RouteWrapper';
import PageWrapper from 'core/PageWrapper';
import { Loader } from 'react-feather';
import ClassesPage from 'pages/dockhouse/classes/ClassesPage';
export const routeClassesPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathClasses,
	navTitle: "Classes",
	pageName: PageName.CLASSES,
}, history => <PageWrapper
	key="classes"
	history={history}
	component={(urlProps: {}, async) => <ClassesPage
	/>}
	urlProps={{}}
	shadowComponent={<Loader />}
/>);
