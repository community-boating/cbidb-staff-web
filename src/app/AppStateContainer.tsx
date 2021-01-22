import { none, Option, some } from 'fp-ts/lib/Option';

import { apiw } from "../async/authenticate-staff";
import { PostURLEncoded, makePostString } from '../core/APIWrapperUtil';

type ServerConfig = {
    // TODO: dev vs prod config

    SELF: {
        host: string,
        https: boolean,
        pathPrefix: string,
        port: number
    },
    API: {
        host: string,
        https: boolean,
        port: number
    }
}

export interface AppProps {

}

type State = {
	appProps: AppProps
	login: {
		authenticatedUserName: Option<string>
	}
	borderless: boolean
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
	updateState = {
		setBorderless: () => {
			this.setState({
				...this.state,
				borderless: true
			});
		},
		login: {
			setLoggedIn: (function(userName: string) {
				const self: AppStateContainer = this
				self.setState({
					...self.state,
					login: {
						...self.state.login,
						authenticatedUserName: some(userName)
					}
				});
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
						authenticatedUserName: none
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
				authenticatedUserName: none
			},
			borderless: false
		};
	}
}

const asc = new AppStateContainer();
export default asc;
