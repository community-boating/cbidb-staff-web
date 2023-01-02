import { Option } from 'fp-ts/lib/Option';

import { BoatTypesType, RatingsType } from 'pages/dockhouse/signouts/StateTypes';

export interface AppProps {

}

export type AppState = {
	appProps: AppProps
	login: {
		authenticatedUserName: Option<string>
		permissions: {[K: number]: true}
	}
	borderless: boolean
	sudo: boolean
	boatTypes: BoatTypesType
    ratings: RatingsType
}

export type UpdateState = {
    setSudo: (on: boolean) => void,
    setBorderless: () => void,
    login: {
        setLoggedIn: (userName: string) => void,
        attemptLogin: (userName: string, password: string) => Promise<boolean>,
        logout: () => void
    },
    init: () => void
}