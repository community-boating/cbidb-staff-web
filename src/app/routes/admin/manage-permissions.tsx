import * as React from "react";
import * as t from "io-ts";

import RouteWrapper from "core/RouteWrapper";
import PageWrapper from "core/PageWrapper";
import Loader from "components/Loader";

import { PageName } from "pages/pageNames";
import { getWrapper, accessStateValidator } from "async/staff/access-state";
import { pathManageAccess } from "app/paths";
import { ManageAccessPage } from "pages/admin/manage-access/ManageAccessPage";

export const routeManageAccess = new RouteWrapper(
	{
		requiresAuth: true,
		exact: true,
		pathWrapper: pathManageAccess,
		sidebarTitle: "Manage Access",
		pageName: PageName.MANAGE_ACCESS,
		requireSudo: true,
	},
	(history) => (
		<PageWrapper
			key="manage Permissions"
			history={history}
			component={(_urlProps: {}, async: t.TypeOf<typeof accessStateValidator>) => (
				<ManageAccessPage accessState={async} />
			)}
			urlProps={{}}
			getAsyncProps={() => {
				return getWrapper.sendJson(null);
			}}
			shadowComponent={<Loader />}
		/>
	)
);
