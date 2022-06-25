import * as React from 'react';
import * as t from 'io-ts';
import UsersPage from '../../pages/users/UsersPage';
import RouteWrapper from '../../core/RouteWrapper';
import PageWrapper from '../../core/PageWrapper';
import Loader from '../../components/Loader';
import {apiw as getUsers, validator} from "../../async/staff/get-users"
import {apiw as getUser, validator as userValidator, formDefault} from "../../async/staff/get-user"
import UserFormPage from '../../pages/users/UserFormPage';
import { PageName } from 'pages/pageNames';
import { optionifyProps } from 'util/OptionifyObjectProps';
import { pathUsersEdit, pathUsersNew, pathUsers } from 'app/paths';

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
	component={(urlProps: {}, async: t.TypeOf<typeof validator>) => <UsersPage
		users={async}
	/>}
	urlProps={{}}
	getAsyncProps={() => {
		return getUsers.sendJson(null).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
	shadowComponent={<Loader />}
/>);

export const routeUsersEditPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathUsersEdit,
	pageName: PageName.USERS_EDIT,
	requireSudo: true,
}, history => <PageWrapper
	key="userEdit"
	history={history}
	component={(urlProps: {userId: number}, async: t.TypeOf<typeof userValidator>) => <UserFormPage
		history={history}
		initialFormState={optionifyProps(async)}
	/>}
	urlProps={{userId: Number(pathUsersEdit.extractURLParams(history.location.pathname).userId)}}
	getAsyncProps={(urlProps: {userId: number}) => {
		return getUser(urlProps.userId).sendJson(null).catch(err => {
			console.log("failed to get user: ", err)
			history.push(pathUsers.getPathFromArgs({}));
			return Promise.reject(null);
		});  // TODO: handle failure
	}}
	shadowComponent={<Loader />}
/>);

export const routeUsersNewPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathUsersNew,
	pageName: PageName.USERS_NEW,
	requireSudo: true,
}, history => <PageWrapper
	key="userNew"
	history={history}
	component={(urlProps: {}) => <UserFormPage
		history={history}
		initialFormState={formDefault}
	/>}
	urlProps={{}}
	shadowComponent={<Loader />}
/>);
