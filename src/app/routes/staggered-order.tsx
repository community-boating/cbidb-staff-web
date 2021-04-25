import * as React from 'react';
import * as t from 'io-ts';
import UsersPage from '../../pages/users/UsersPage';
import RouteWrapper from '../../core/RouteWrapper';
import PageWrapper from '../../core/PageWrapper';
import PathWrapper from '../../core/PathWrapper';
import Loader from '../../components/Loader';
import UserFormPage from '../../pages/users/UserFormPage';
import { Option, some, none } from 'fp-ts/lib/Option';
import JpClassesPage from 'pages/juniorProgram/JpClasses/JpClassesPage';
import {apiw, validator} from "@async/staff/open-order-details"
import { PageName } from 'pages/pageNames';
import StaggeredOrder from 'pages/misc/StaggeredOrder';

const path = new PathWrapper("staggered-order/:personId");

export const staggeredOrderRoute = new RouteWrapper({requiresAuth: true, exact: true, pathWrapper: path, sidebarTitle: "Staggered Order"}, history => <PageWrapper
	key="staggered-order"
	pageName={PageName.STAGGERED_ORDER}
	history={history}
	component={(urlProps: {personId: number}, payments: t.TypeOf<typeof validator>) => <StaggeredOrder
		history={history}
		personId={urlProps.personId}
		payments={payments}
	/>}
	urlProps={{personId: Number(path.extractURLParams(history.location.pathname).personId)}}
	getAsyncProps={(urlProps: {personId: number}) => {
		return apiw(urlProps.personId).send(null)
	}}
	shadowComponent={<Loader />}
/>);
