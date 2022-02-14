import * as React from "react";
import * as t from "io-ts";

import RouteWrapper from "@core/RouteWrapper";
import PageWrapper from "@core/PageWrapper";
import Loader from "@components/Loader";

import { PageName } from "pages/pageNames";
import ManageClassLocationsPage from "pages/admin/ManageClassLocationsPage";
import { validator, getWrapper } from "@async/rest/class-locations";
import { manageClassLocationsPath } from "@app/paths";

export const manageClassLocationsPageRoute = new RouteWrapper(
	{
		requiresAuth: true,
		exact: true,
		pathWrapper: manageClassLocationsPath,
		sidebarTitle: "Manage Class Locations",
		pageName: PageName.MANAGE_CLASS_LOCATIONS,
		requireSudo: true,
	},
	(history) => (
		<PageWrapper
			key="manage class locations"
			history={history}
			component={(_urlProps: {}, async: t.TypeOf<typeof validator>) => (
				<ManageClassLocationsPage locations={async} />
			)}
			urlProps={{}}
			getAsyncProps={() => {
				return getWrapper.send(null);
			}}
			shadowComponent={<Loader />}
		/>
	)
);
