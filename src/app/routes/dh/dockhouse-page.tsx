import * as React from 'react';
import * as t from "io-ts";
import { PageName } from 'pages/pageNames';
import { pathDockhousePage } from 'app/paths';
import RouteWrapper from 'core/RouteWrapper';
import PageWrapper from 'core/PageWrapper';
import { Loader } from 'react-feather';
import DockHousePage from 'pages/dockhouse/main/DockHousePage';
import { ApiResult } from 'core/APIWrapperTypes';

type ApiResultT = ApiResult<any>;

const dummyRes: ApiResultT = {type: "Success", success: {}};

export const routeDockhousePage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathDockhousePage,
	navTitle: "Home",
	navOrder: 0,
	pageName: PageName.DOCK_HOUSE_PAGE,
}, history => <PageWrapper
	key="dockhousepage"
	history={history}
	component={(urlProps: {}, async: any) => <DockHousePage
		initState={async}
	/>}
	urlProps={{}}
	shadowComponent={<Loader />}
	getAsyncProps = {() => {
		return Promise.resolve(dummyRes);
	}}
/>);
