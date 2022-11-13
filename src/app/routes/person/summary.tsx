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

type AsyncResult = [t.TypeOf<typeof validator>, t.TypeOf<typeof ratingsValidator>[]]

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
			component={(_urlProps: {personId: number},  [person, ratings]: AsyncResult) => (
				<PersonSummaryPage
					person={person}
					ratings={ratings}
				/>
			)}
			urlProps={{personId: (function() {
				return Number(pathPersonSummary.extractURLParams(history.location.pathname).personId)
			}())}}
			getAsyncProps={(urlProps: { personId: number }) => {
				return Promise.all([
					getWrapper(urlProps.personId).send(),
					getRatings(urlProps.personId).send()
				]).then(([summaryRes, ratingsRes]) => {
					if (summaryRes.type == "Success" && ratingsRes.type == "Success") {
						return Promise.resolve({type: "Success", success: [summaryRes.success, ratingsRes.success]} as ApiResult<AsyncResult>)
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
