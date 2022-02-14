import * as React from "react";
import * as t from "io-ts";

import RouteWrapper from "@core/RouteWrapper";
import PageWrapper from "@core/PageWrapper";
import Loader from "@components/Loader";
import { PageName } from "pages/pageNames";
import PersonSummaryPage from "pages/summary/PersonSummaryPage";
import { validator, getWrapper } from "@async/rest/person/get-person";
import { pathPersonSearch, pathPersonSummary } from "@app/paths";

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
			component={(_urlProps: {personId: number},  async: t.TypeOf<typeof validator>) => (
				<PersonSummaryPage person={async}  />
			)}
			urlProps={{personId: (function() {
				return Number(pathPersonSummary.extractURLParams(history.location.pathname).personId)
			}())}}
			getAsyncProps={(urlProps: { personId: number }) => {
				return getWrapper(urlProps.personId)
					.send(null)
					.catch((err) => {
						console.log("failed to get person: ", err);
						history.push(pathPersonSearch.getPathFromArgs({}));
						return Promise.reject(null);
					}); // TODO: handle failure
			}}
			shadowComponent={<Loader />}
		/>
	)
);
