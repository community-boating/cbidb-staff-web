import { none, Option, some } from 'fp-ts/lib/Option';
import * as t from 'io-ts';

import { apiw } from "../async/authenticate-staff";
import { makePostString } from '../core/APIWrapperUtil';
import {apiw as getPermissions, validator as permissionsValidator} from "@async/staff/user-permissions"
import { showSudoToastr } from '@components/SudoModal';

type Permissions = t.TypeOf<typeof permissionsValidator>;

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
		permissions: Option<Permissions>
	}
	borderless: boolean
	sudo: boolean
}

export class AppStateContainer {
	state: State
	setState = (state: State) => {
		this.state = state;
		console.log("asc updated state: ", this.state)
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
			//showSudoToastr();
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
				console.log("setting logged in as ", userName)
				const self: AppStateContainer = this
				getPermissions().send(null).then(res => {
					if (res.type == "Success") {
						self.setState({
							...self.state,
							login: {
								...self.state.login,
								authenticatedUserName: some(userName),
								permissions: some(res.success)
							}
						});
					} else {
						self.setState({
							...self.state,
							login: {
								...self.state.login,
								authenticatedUserName: some(userName),
								permissions: none
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
				const payload = makePostString("username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password))
				return apiw().send(payload).then(res => {
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
						permissions: none
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
				permissions: none
			},
			borderless: false,
			sudo: (process.env.config as any).instantSudo,
		};
	}
}

const asc = new AppStateContainer();
export default asc;
