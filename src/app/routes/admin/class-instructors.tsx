import RouteWrapper from 'core/RouteWrapper';
import * as t from 'io-ts';
import PageWrapper from 'core/PageWrapper';
import * as React from 'react';
import { PageName } from 'pages/pageNames';
import {validator, getWrapper} from "async/rest/class-instructor"
import Loader from 'components/Loader';
import ManageClassInstructorsPage from 'pages/admin/ManageClassInstructorsPage';
import { pathManageClassInstructors } from 'app/paths';

export const routeManageClassInstructorsPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathManageClassInstructors,
	sidebarTitle: "Manage Instructors",
	pageName: PageName.MANAGE_INSTRUCTORS,
	requireSudo: true,
}, history => <PageWrapper
	key="manage insructors"
	history={history}
	component={(urlProps: {}, async: t.TypeOf<typeof validator>) => <ManageClassInstructorsPage
		instructors={async}
	/>}
	urlProps={{}}
	getAsyncProps={() => {
		return getWrapper.sendJson(null)
	}}
	shadowComponent={<Loader />}
/>);
