import { showSudoToastr } from 'components/wrapped/Toast';
import { none } from 'fp-ts/lib/Option';

import { AppState, UpdateState } from './AppState';

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

export class AppStateContainer{
	state: AppState
	setState = (state: Partial<AppState>) => {
		this.state = Object.assign(this.state, state);
		if (this.listener) this.listener();
	}
	listener: () => void
	setListener=(listener: () => void) => {
		this.listener = listener
	}
	updateState: UpdateState
	public constructor() {
		this.state = {
			appProps: null,
			login: {
				authenticatedUserName: none,
				permissions: null
			},
			borderless: false,
			sudo: (process.env.config as any).instantSudo,
			boatTypes: [],
			ratings: []
		};
	}
	sudoModalOpener: () => void
	setSudoModalOpener=(sudoModalOpener: () => void) => {
		this.sudoModalOpener = sudoModalOpener
	}
	confirmSudo = (then: () => void) => {
		if (this.state.sudo) {
			then();
		} else {
			showSudoToastr();
		}
	}
}

const asc = new AppStateContainer();
export default asc;
