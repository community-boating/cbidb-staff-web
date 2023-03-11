import RouteWrapper from 'core/RouteWrapper';
import PageWrapper from 'core/PageWrapper';
import * as React from 'react';
import { PageName } from 'pages/pageNames';
import Loader from 'components/Loader';
import { pathSyncSlackUsers } from 'app/paths';
import SyncSlackUsersPage from 'pages/admin/SyncSlackUsersPage';

export const routeSyncSlackUsersPage = new RouteWrapper({
	requiresAuth: true,
	exact: true,
	pathWrapper: pathSyncSlackUsers,
	sidebarTitle: "Slack Sync",
	pageName: PageName.SYNC_SLACK_USERS,
}, history => <PageWrapper
	key="Slack Sync"
	history={history}
	component={(urlProps: {}) => <SyncSlackUsersPage />}
	urlProps={{}}
	shadowComponent={<Loader />}
/>);
