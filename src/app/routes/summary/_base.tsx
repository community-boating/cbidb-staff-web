import * as React from "react";

import PathWrapper from "@core/PathWrapper";
import RouteWrapper from "@core/RouteWrapper";
import PageWrapper from "@core/PageWrapper";
import Loader from "@components/Loader";
import { PageName } from "pages/pageNames";
import PersonSearchPage from "pages/summary/PersonSearchPage";

export const personBasePath = new PathWrapper("person");

export const searchPageRoute = new RouteWrapper(
	{
		requiresAuth: true,
		exact: true,
		pathWrapper: personBasePath,
		sidebarTitle: "Search Members",
		pageName: PageName.PERSON_SEARCH,
		requireSudo: true,
	},
	(history) => (
		<PageWrapper
			key="person search"
			history={history}
			component={(urlProps: {}) => <PersonSearchPage />}
			urlProps={{}}
			shadowComponent={<Loader />}
		/>
	)
);
