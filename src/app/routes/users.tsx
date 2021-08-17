import * as React from 'react';
import * as t from 'io-ts';
import UsersPage from '../../pages/users/UsersPage';
import RouteWrapper from '../../core/RouteWrapper';
import PageWrapper from '../../core/PageWrapper';
import PathWrapper from '../../core/PathWrapper';
import Loader from '../../components/Loader';
import {apiw as getUsers, validator} from "../../async/staff/get-users"
import {apiw as getUser, validator as userValidator, formDefault} from "../../async/staff/get-user"
import UserFormPage from '../../pages/users/UserFormPage';
import { PageName } from 'pages/pageNames';
import { optionifyProps } from '@util/OptionifyObjectProps';

const usersPath = new PathWrapper("users");

export const usersPageRoute = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: usersPath,
	sidebarTitle: "Users",
	pageName: PageName.USERS,
}, history => <PageWrapper
	key="users"
	history={history}
	component={(urlProps: {}, async: t.TypeOf<typeof validator>) => <UsersPage
		users={async}
	/>}
	urlProps={{}}
	getAsyncProps={() => {
		return getUsers.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
	shadowComponent={<Loader />}
/>);

const usersEditPath = usersPath.appendPathSegment<{userId: string}>(":userId")

export const usersEditPageRoute = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: usersEditPath,
	pageName: PageName.USERS_EDIT,
}, history => <PageWrapper
	key="userEdit"
	history={history}
	component={(urlProps: {userId: number}, async: t.TypeOf<typeof userValidator>) => <UserFormPage
		history={history}
		initialFormState={optionifyProps(async)}
	/>}
	urlProps={{userId: (function() {
		console.log("hi")
		console.log(history.location.pathname)
		return Number(usersEditPath.extractURLParams(history.location.pathname).userId)
	}())}}
	getAsyncProps={(urlProps: {userId: number}) => {
		console.log(urlProps)
		return getUser(urlProps.userId).send(null).catch(err => {
			console.log("failed to get user: ", err)
			history.push(usersPath.getPathFromArgs({}));
			return Promise.reject(null);
		});  // TODO: handle failure
	}}
	shadowComponent={<Loader />}
/>);

const usersNewPath = usersPath.appendPathSegment("new")

export const usersNewPageRoute = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: usersNewPath,
	pageName: PageName.USERS_NEW,
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
