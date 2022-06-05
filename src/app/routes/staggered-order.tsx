import * as React from 'react';
import * as t from 'io-ts';
import RouteWrapper from '../../core/RouteWrapper';
import PageWrapper from '../../core/PageWrapper';
import Loader from '../../components/Loader';
import {apiw, validator} from "async/staff/open-order-details"
import { PageName } from 'pages/pageNames';
import StaggeredOrder from 'pages/misc/StaggeredOrder';
import { pathStaggeredOrder } from 'app/paths';

export const routeStaggeredOrder = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathStaggeredOrder,
	sidebarTitle: "Staggered Order",
	pageName: PageName.STAGGERED_ORDER,
}, history => <PageWrapper
	key="staggered-order"
	history={history}
	component={(urlProps: {personId: number}, payments: t.TypeOf<typeof validator>) => <StaggeredOrder
		history={history}
		personId={urlProps.personId}
		payments={payments}
	/>}
	urlProps={{personId: Number(pathStaggeredOrder.extractURLParams(history.location.pathname).personId)}}
	getAsyncProps={(urlProps: {personId: number}) => {
		return apiw(urlProps.personId).send(null)
	}}
	shadowComponent={<Loader />}
/>);
