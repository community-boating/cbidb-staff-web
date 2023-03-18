import * as React from 'react';
import RouteWrapper from '../../../core/RouteWrapper';
import PageWrapper from '../../../core/PageWrapper';
import Loader from '../../../components/Loader';
import { PageName } from 'pages/pageNames';
import { pathMessageTest } from 'app/paths';
import MessageTest from 'pages/misc/MessageTest';

export const routeMessageTest = new RouteWrapper({
	requiresAuth: false,
	exact: true,
	pathWrapper: pathMessageTest,
	sidebarTitle: "Message Test",
	pageName: PageName.MESSAGE_TEST,
}, history => <PageWrapper
	key="message-test"
	history={history}
	component={(urlProps: {}) => <MessageTest

	/>}
	urlProps={{}}
	shadowComponent={<Loader />}
/>);
