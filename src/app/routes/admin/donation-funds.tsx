import * as React from "react";
import * as t from "io-ts";

import RouteWrapper from "core/RouteWrapper";
import PageWrapper from "core/PageWrapper";
import Loader from "components/Loader";

import { PageName } from "pages/pageNames";
import ManageDonationFundsPage from "pages/admin/ManageDonationFundsPage";
import { validator, getWrapper } from "async/rest/donation-funds";
import { pathManageDonationFunds } from "app/paths";

export const routeManageDonationFundsPage = new RouteWrapper(
	{
		requiresAuth: true,
		exact: true,
		pathWrapper: pathManageDonationFunds,
		sidebarTitle: "Manage Donation Funds",
		pageName: PageName.MANAGE_DONATION_FUNDS,
		requireSudo: true,
	},
	(history) => (
		<PageWrapper
			key="manage donation funds"
			history={history}
			component={(_urlProps: {}, async: t.TypeOf<typeof validator>) => (
				<ManageDonationFundsPage donationFunds={async} />
			)}
			urlProps={{}}
			getAsyncProps={() => {
				return getWrapper.sendJson(undefined);
			}}
			shadowComponent={<Loader />}
		/>
	)
);
