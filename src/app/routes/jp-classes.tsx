import * as React from 'react';
import * as t from 'io-ts';
import UsersPage from '../../pages/users/UsersPage';
import RouteWrapper from '../../core/RouteWrapper';
import PageWrapper from '../../core/PageWrapper';
import PathWrapper from '../../core/PathWrapper';
import Loader from '../../components/Loader';
import UserFormPage from '../../pages/users/UserFormPage';
import { Option, some, none } from 'fp-ts/lib/Option';
import JpClassesPage from 'pages/juniorProgram/JpClassesPage';
import {apiw as getSignups, validator} from "@async/staff/all-jp-signups"

const jpClassesPath = new PathWrapper("jp-classes");

export const jpClassesPageRoute = new RouteWrapper({requiresAuth: true, exact: true, pathWrapper: jpClassesPath, sidebarTitle: "JP Classes"}, history => <PageWrapper
	key="jpclasses"
	history={history}
	component={(urlProps: {}, asyncProps: t.TypeOf<typeof validator>) => <JpClassesPage
		signups={asyncProps.signups}
		instances={asyncProps.instances}
	/>}
	urlProps={{}}
	getAsyncProps={() => {
		return getSignups.send(null)
	}}
	shadowComponent={<Loader />}
/>);
