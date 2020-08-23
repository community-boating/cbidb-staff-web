import * as React from 'react';
import * as t from 'io-ts';
import UsersPage from '../../pages/UsersPage';
import RouteWrapper from '../../core/RouteWrapper';
import PageWrapper from '../../core/PageWrapper';
import PathWrapper from '../../core/PathWrapper';
import Loader from '../../components/Loader';
import {apiw as getUsers, validator} from "../../async/staff/get-users"
import UserFormPage from '../../pages/UserFormPage';

const usersPath = new PathWrapper("users");

export const usersPageRoute = new RouteWrapper(true, usersPath, history => <PageWrapper
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

export const usersEditPageRoute = new RouteWrapper(true, usersEditPath, history => <PageWrapper
	key="users"
	history={history}
	component={(urlProps: {userId: number}, async: t.TypeOf<typeof validator>) => <UserFormPage
		userId={urlProps.userId}
	/>}
	urlProps={{userId: Number(usersEditPath.extractURLParams(history.location.pathname).userId)}}
	getAsyncProps={() => {
		return getUsers.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
	shadowComponent={<Loader />}
/>);