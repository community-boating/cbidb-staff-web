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
import { Option, some, none } from 'fp-ts/lib/Option';
import JpClassesPage from 'pages/juniorProgram/JpClassesPage';

const jpClassesPath = new PathWrapper("jp-classes");

export const jpClassesPageRoute = new RouteWrapper({requiresAuth: true, exact: true, pathWrapper: jpClassesPath, sidebarTitle: "JP Classes"}, history => <PageWrapper
	key="jpclasses"
	history={history}
	component={(urlProps: {}) => <JpClassesPage

	/>}
	urlProps={{}}

	shadowComponent={<Loader />}
/>);
