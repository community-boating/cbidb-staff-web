import * as React from "react";

import RouteWrapper from "@core/RouteWrapper";
import PageWrapper from "@core/PageWrapper";
import Loader from "@components/Loader";
import { PageName } from "pages/pageNames";
import PersonSearchPage from "pages/summary/PersonSearchPage";
import { pathPersonSearch } from "@app/paths";

export const routePersonSearch = new RouteWrapper(
	{
		requiresAuth: true,
		exact: true,
		pathWrapper: pathPersonSearch,
		sidebarTitle: "Search Members",
		pageName: PageName.PERSON_SEARCH,
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
