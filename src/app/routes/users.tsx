import * as React from 'react';
import * as t from 'io-ts';
import UsersPage from '../../pages/Users';
import RouteWrapper from '../../core/RouteWrapper';
import PageWrapper from '../../core/PageWrapper';
import PathWrapper from '../../core/PathWrapper';
import Loader from '../../components/Loader';
import {apiw as getUsers, validator} from "../../async/staff/get-users"

export const usersPageRoute = new RouteWrapper(true, new PathWrapper("users"), history => <PageWrapper
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
