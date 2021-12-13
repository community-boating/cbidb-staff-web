import * as React from "react";
import * as t from "io-ts";

import { personBasePath } from "./_base";
import RouteWrapper from "@core/RouteWrapper";
import PageWrapper from "@core/PageWrapper";
import Loader from "@components/Loader";
import { PageName } from "pages/pageNames";
import PersonSummaryPage from "pages/summary/PersonSummaryPage";
import { validator, getWrapper } from "@async/rest/person/get-person";

const personSummaryPath = personBasePath.appendPathSegment<{personId: string}>(":personId")

export const summaryPageRoute = new RouteWrapper(
	{
		requiresAuth: true,
		exact: true,
		pathWrapper: personSummaryPath,
		sidebarTitle: "Person Summary",
		pageName: PageName.PERSON_SUMMARY,
		requireSudo: true,
	},
	(history) => (
		<PageWrapper
			key="person summary"
			history={history}
			component={(_urlProps: {personId: number},  async: t.TypeOf<typeof validator>) => (
				<PersonSummaryPage person={async}  />
			)}
			urlProps={{personId: (function() {
				console.log("person summary page")
				console.log(history.location.pathname)
				return Number(personSummaryPath.extractURLParams(history.location.pathname).personId)
			}())}}
			getAsyncProps={(urlProps: { personId: number }) => {
				console.log(urlProps);
				return getWrapper(urlProps.personId)
					.send(null)
					.catch((err) => {
						console.log("failed to get person: ", err);
						history.push(personBasePath.getPathFromArgs({}));
						return Promise.reject(null);
					}); // TODO: handle failure
			}}
			shadowComponent={<Loader />}
		/>
	)
);
