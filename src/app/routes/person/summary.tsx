import * as React from "react";
import * as t from "io-ts";

import RouteWrapper from "core/RouteWrapper";
import PageWrapper from "core/PageWrapper";
import Loader from "components/Loader";
import { PageName } from "pages/pageNames";
import PersonSummaryPage from "pages/summary/PersonSummaryPage/PersonSummaryPage";
import { validator, getWrapper } from "async/rest/person/get-person";
import { pathPersonSearch, pathPersonSummary } from "app/paths";
import {getWrapper as getRatings} from 'async/staff/rating-html'
import {validator as ratingsValidator} from 'async/staff/rating-html'
import {ApiResult} from 'core/APIWrapperTypes'
import { membershipValidator, getWrapper as getMemberships } from "async/rest/person/get-person-memberships";
import {getWrapper as getMembershipTypes, memTypeValidator} from "async/rest/membership-types"

type AsyncResult = [
	t.TypeOf<typeof validator>,
	t.TypeOf<typeof ratingsValidator>[],
	t.TypeOf<typeof membershipValidator>[],
	t.TypeOf<typeof memTypeValidator>[]
];

export const routePersonSummary = new RouteWrapper(
	{
		requiresAuth: true,
		exact: true,
		pathWrapper: pathPersonSummary,
		sidebarTitle: "Person Summary",
		pageName: PageName.PERSON_SUMMARY,
	},
	(history) => (
		<PageWrapper
			key="person summary"
			history={history}
			component={(_urlProps: {personId: number},  [person, ratings, memberships, membershipTypes]: AsyncResult) => (
				<PersonSummaryPage
					person={person}
					ratings={ratings}
					memberships={memberships}
					membershipTypes={membershipTypes}
				/>
			)}
			urlProps={{personId: (function() {
				return Number(pathPersonSummary.extractURLParams(history.location.pathname).personId)
			}())}}
			getAsyncProps={(urlProps: { personId: number }) => {
				return Promise.all([
					getWrapper(urlProps.personId).send(),
					getRatings(urlProps.personId).send(),
					getMemberships(urlProps.personId).send(),
					getMembershipTypes.send()
				]).then(([
					summaryRes,
					ratingsRes,
					membershipsRes,
					membershipTypesRes
				]) => {
					if (
						summaryRes.type == "Success" &&
						ratingsRes.type == "Success" &&
						membershipsRes.type == "Success" &&
						membershipTypesRes.type == "Success"
					 ) {
						return Promise.resolve({type: "Success", success: [
							summaryRes.success,
							ratingsRes.success,
							membershipsRes.success,
							membershipTypesRes.success
						]} as ApiResult<AsyncResult>)
					}
					else return Promise.reject()
				}).catch((err) => {
					console.log("failed to get person: ", err);
					history.push(pathPersonSearch.getPathFromArgs({}));
					return Promise.reject(null);
				});
			}}
			shadowComponent={<Loader />}
		/>
	)
);


