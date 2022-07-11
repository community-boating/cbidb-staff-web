import * as React from "react";
import * as t from "io-ts";

import RouteWrapper from "core/RouteWrapper";
import PageWrapper from "core/PageWrapper";
import Loader from "components/Loader";

import { PageName } from "pages/pageNames";
import { getWrapper, accessStateValidator } from "async/staff/access-state";
import { pathManagePermissions } from "app/paths";
import { ManagePermissionsPage } from "pages/admin/ManagePermissionsPage";

export const routeManagePermissions = new RouteWrapper(
	{
		requiresAuth: true,
		exact: true,
		pathWrapper: pathManagePermissions,
		sidebarTitle: "Manage Permissions",
		pageName: PageName.MANAGE_PERMISSIONS,
		requireSudo: true,
	},
	(history) => (
		<PageWrapper
			key="manage Permissions"
			history={history}
			component={(_urlProps: {}, async: t.TypeOf<typeof accessStateValidator>) => (
				<ManagePermissionsPage accessState={async} />
			)}
			urlProps={{}}
			getAsyncProps={() => {
				return getWrapper.sendJson(null);
			}}
			shadowComponent={<Loader />}
		/>
	)
);
