import * as React from 'react';
import * as t from "io-ts";
import { PageName } from 'pages/pageNames';
import { pathSignoutsTables } from 'app/paths';
import RouteWrapper from 'core/RouteWrapper';
import PageWrapper from 'core/PageWrapper';
import { Loader } from 'react-feather';
import { SignoutsTablesPage } from 'pages/dockhouse/signouts/SignoutsTablesPage';
import { signoutsValidator, signoutValidator, getSignoutsToday, putSignout, ratingsValidator, getRatings } from 'async/rest/signouts-tables';
import { toMomentFromLocalDate, toMomentFromLocalDateTime } from 'util/dateUtil';
import { ApiResult, Success } from 'core/APIWrapperTypes';

import { Option,some,none } from 'fp-ts/lib/Option';

/*
const fakeResult : Success<t.TypeOf<typeof signoutsValidator>> = {
	type: "Success",
	success: [{
		signoutId: 10,
		programId: some(20),
		boatId: some(30),
		personId: some(50),
		cardNumber: some("abcd"),
		sailNumber: 20,
		hullNumber: some("hull"),
		signoutDatetime: some("time"),
		signinDatetime: some("time"),
		testRatingId: some(10),
		testResult: some("failure"),
		signoutType: "what",
		didCapsize: some(true),
		comments: some("ok"),
		crew: [{
			crewId: some(100),
			signoutId: some(10),
			cardNumber: some("abcd"),
			personId: some(1030),
			startActive: some("yes"),
			endActive: some("what")
		},
		{
			crewId: some(200),
			signoutId: some(10),
			cardNumber: some("asdf"),
			personId: some(1060),
			startActive: some("yes"),
			endActive: some("what")
		}]
	}]
};
;
*/
export const routeSignoutsTablesPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathSignoutsTables,
	sidebarTitle: "Signouts Tables",
	pageName: PageName.SIGNOUTS_TABLES,
}, history => <PageWrapper
	autoRefresh={1000000}
	key="signoutstables"
	history={history}
	component={(urlProps: {}, async: t.TypeOf<typeof signoutsValidator>) => <SignoutsTablesPage
		initState={async}
	/>}
	urlProps={{}}
	getAsyncProps = {() => {
		return getSignoutsToday.send()
	}}
	shadowComponent={<Loader />}
/>);
