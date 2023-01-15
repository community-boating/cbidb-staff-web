import { none } from 'fp-ts/lib/Option';

import { AppState, AppStateAction, AppStateCombined } from './AppState';

import * as React from 'react';

// type ServerConfig = {
// 		// TODO: dev vs prod config

// 		SELF: {
// 				host: string,
// 				https: boolean,
// 				pathPrefix: string,
// 				port: number
// 		},
// 		API: {
// 				host: string,
// 				https: boolean,
// 				port: number
// 		}
// }

export const defaultAppState: AppState = {
		appProps: null,
		login: {
			authenticatedUserName: none,
			permissions: null
		},
		borderless: false,
		sudo: (process.env.config as any).instantSudo,
		boatTypes: [],
		ratings: [],
		sudoModalOpener: () => {},
};

export const AppStateContext = React.createContext<AppStateCombined>({
	state: defaultAppState,
	stateAction: undefined,
});

//const asc = new AppStateContainer();
//export default asc;
