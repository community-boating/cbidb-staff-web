import * as React from 'react';
import * as t from 'io-ts';
import RouteWrapper from '../../core/RouteWrapper';
import PageWrapper from '../../core/PageWrapper';
import Loader from '../../components/Loader';
import JpClassesPage from 'pages/juniorProgram/JpClasses/JpClassesPage';
import {apiw as getSignups, validator} from "async/staff/all-jp-signups"
import { PageName } from 'pages/pageNames';
import { pathJpClasses } from 'app/paths';

export const routeJpClassesPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathJpClasses,
	sidebarTitle: "JP Classes",
	pageName: PageName.JP_CLASSES,
}, history => <PageWrapper
	key="jpclasses"
	history={history}
	component={(urlProps: {}, {signups, instances, weeks, staggers}: t.TypeOf<typeof validator>) => <JpClassesPage
		signups={signups}
		instances={instances}
		weeks={weeks}
		staggers={staggers}
	/>}
	urlProps={{}}
	getAsyncProps={() => {
		return getSignups.send()
	}}
	shadowComponent={<Loader />}
/>);
