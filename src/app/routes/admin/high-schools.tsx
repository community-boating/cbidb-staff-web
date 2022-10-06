import * as React from "react";
import * as t from "io-ts";

import RouteWrapper from "core/RouteWrapper";
import PageWrapper from "core/PageWrapper";
import Loader from "components/Loader";

import { PageName } from "pages/pageNames";
import ManageHighSchoolsPage from "pages/admin/ManageHighSchoolsPage";
import { validator, getWrapper } from "async/rest/high-schools";
import { pathManageHighSchools } from "app/paths";

export const routeManageHighSchools = new RouteWrapper(
	{
		requiresAuth: true,
		exact: true,
		pathWrapper: pathManageHighSchools,
		sidebarTitle: "Manage High Schools",
		pageName: PageName.MANAGE_HIGH_SCHOOLS,
		requireSudo: true,
	},
	(history) => (
		<PageWrapper
			key="manage high schools"
			history={history}
			component={(_urlProps: {}, async: t.TypeOf<typeof validator>) => (
				<ManageHighSchoolsPage highSchools={async} />
			)}
			urlProps={{}}
			getAsyncProps={() => {
				return getWrapper.send();
			}}
			shadowComponent={<Loader />}
		/>
	)
);
