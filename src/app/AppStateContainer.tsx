import { none, Option, some } from 'fp-ts/lib/Option';

import { apiw } from "../async/authenticate-staff";
import {apiw as getPermissions} from "async/staff/user-permissions"
import { showSudoToastr } from 'components/SudoModal';

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

export interface AppProps {

}

type State = {
	appProps: AppProps
	login: {
		authenticatedUserName: Option<string>,
		permissions: {[K: number]: true}
	}
	borderless: boolean
	sudo: boolean
}

export class AppStateContainer {
	state: State
	setState = (state: State) => {
		this.state = state;
		if (this.listener) this.listener();
	}
	listener: () => void
	setListener=(listener: () => void) => {
		this.listener = listener
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
	updateState = {
		setSudo: (on: boolean) => this.setState({
			...this.state,
			sudo: on
		}),
		setBorderless: () => {
			this.setState({
				...this.state,
				borderless: true
			});
		},
		login: {
			setLoggedIn: (function(userName: string) {
				const self: AppStateContainer = this
				getPermissions().sendJson(null).then(res => {
					if (res.type == "Success") {
						self.setState({
							...self.state,
							login: {
								...self.state.login,
								authenticatedUserName: some(userName),
								permissions: res.success.reduce((hash, perm) => {
									hash[perm] = true;
									return hash;
								}, {})
							}
						});
					} else {
						self.setState({
							...self.state,
							login: {
								...self.state.login,
								authenticatedUserName: some(userName),
								permissions: {}
							}
						});
					}
				})
				
			//	Sentry.configureScope(function(scope) {
			//		scope.setUser({"username": userName});
			//	});
			}).bind(this),
			attemptLogin: (function(userName: string, password: string): Promise<boolean> {
				const self: AppStateContainer = this
				return apiw().sendFormUrlEncoded({username: userName, password}).then(res => {
					if (res.type == "Success" && res.success) {
						self.updateState.login.setLoggedIn(userName);
						return true;
					} else return false;
				})
			}).bind(this),
			logout: () => {
				this.setState({
					...this.state,
					login: {
						authenticatedUserName: none,
						permissions: {}
					}
				})
			}
		},
		appProps: (appProps: AppProps) => {
			this.setState({
				...this.state,
				appProps
			})
		}
	}
	constructor() {
		this.state = {
			appProps: null,
			login: {
				authenticatedUserName: none,
				permissions: null
			},
			borderless: false,
			sudo: (process.env.config as any).instantSudo,
		};
	}
}

const asc = new AppStateContainer();
export default asc;
