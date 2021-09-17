import * as React from "react";
import * as t from "io-ts";

import RouteWrapper from "@core/RouteWrapper";
import PageWrapper from "@core/PageWrapper";
import Loader from "@components/Loader";

import { adminBasePath } from "./_base";
import { PageName } from "pages/pageNames";
import ManageTagsPage from "pages/admin/ManageTagsPage";
import { validator, getWrapper } from "@async/rest/tags";

export const manageTagsPath = adminBasePath.appendPathSegment("tags");

export const manageTagsPageRoute = new RouteWrapper(
    {
        requiresAuth: true,
        exact: true,
        pathWrapper: manageTagsPath,
        sidebarTitle: "Manage Tags",
        pageName: PageName.MANAGE_TAGS,
        requireSudo: true,
    },
    (history) => (
        <PageWrapper
            key="manage tags"
            history={history}
            component={(_urlProps: {}, async: t.TypeOf<typeof validator>) => (
                <ManageTagsPage tags={async} />
            )}
            urlProps={{}}
            getAsyncProps={() => {
                return getWrapper.send(null);
            }}
            shadowComponent={<Loader />}
        />
    )
);
