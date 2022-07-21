import * as React from 'react';
import * as t from 'io-ts';
import UsersPage from 'pages/admin/UsersPage';
import RouteWrapper from 'core/RouteWrapper';
import PageWrapper from 'core/PageWrapper';
import Loader from 'components/Loader';
import {getWrapper as getUsers, userValidator} from "async/staff/user"
import { PageName } from 'pages/pageNames';
import { pathUsers } from 'app/paths';
import {getWrapper as getAccessState, accessStateValidator} from 'async/staff/access-state'

const userArrayValidator = t.array(userValidator);

export const routeUsersPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathUsers,
	sidebarTitle: "Users",
	pageName: PageName.USERS,
	requireSudo: true,
}, history => <PageWrapper
	key="users"
	history={history}
	component={(
		urlProps: {},
		[users, accessState]: [t.TypeOf<typeof userArrayValidator>, t.TypeOf<typeof accessStateValidator>]
	) => <UsersPage
		users={users}
		accessState={accessState}
	/>}
	urlProps={{}}
	getAsyncProps={() => {
		return Promise.all([
			getUsers.sendJson(null),
			getAccessState.sendJson(null)
		]).catch(err => Promise.resolve(null));
	}}
	shadowComponent={<Loader />}
/>);
