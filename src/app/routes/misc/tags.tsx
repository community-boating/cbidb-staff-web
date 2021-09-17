import RouteWrapper from "@core/RouteWrapper";
import * as t from "io-ts";
import PageWrapper from "@core/PageWrapper";
import * as React from "react";
import { miscBasePath } from "./_base";
import { PageName } from "pages/pageNames";
import { validator, getWrapper } from "@async/rest/tags";
import Loader from "@components/Loader";
import ManageTagsPage from "pages/misc/ManageTagsPage";

export const manageTagsPath = miscBasePath.appendPathSegment("tags");

export const manageTagsPageRoute = new RouteWrapper(
    {
        requiresAuth: true,
        exact: true,
        pathWrapper: manageTagsPath,
        sidebarTitle: "Manage Tags",
        pageName: PageName.MANAGE_TAGS,
        requireSudo: false,
    },
    (history) => (
        <PageWrapper
            key="manage tags"
            history={history}
            component={(urlProps: {}, async: t.TypeOf<typeof validator>) => (
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
