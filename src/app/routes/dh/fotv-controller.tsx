import * as React from 'react';
import { PageName } from 'pages/pageNames';
import { pathFOTVController } from 'app/paths';
import RouteWrapper from 'core/RouteWrapper';
import PageWrapper from 'core/PageWrapper';
import { Loader } from 'react-feather';
import FOTVControllerPage from 'pages/dockhouse/fotv-controller/FOTVControllerPage';
export const routeFOTVControllerPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathFOTVController,
	navTitle: "FOTV Controller",
	pageName: PageName.FOTV_CONTROLLER,
}, history => <PageWrapper
	key="fotv_controller"
	history={history}
	component={(urlProps: {}, async) => <FOTVControllerPage/>}
	urlProps={{}}
	shadowComponent={<Loader />}
/>);
