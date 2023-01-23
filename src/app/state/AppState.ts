import { DHGlobals } from 'async/staff/dockhouse/dh-globals';
import { Option } from 'fp-ts/lib/Option';

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
    sudoModalOpener: () => void
    hasInit: boolean
}

export type AppStateDerived = {
    confirmSudo: (then: () => void) => void
};

export type AppStateAction = {
    setSudo: (on: boolean) => void
    setBorderless: () => void
    login: {
        setLoggedIn: (userName: string) => void
        attemptLogin: (userName: string, password: string) => Promise<boolean>
        logout: () => void
    }
    setSudoModalOpener: (sudoModalOpener: () => void) => void
}

export type AppStateCombined = {
    state: AppState
    stateAction: AppStateAction
    //stateDerived: AppStateDerived
}