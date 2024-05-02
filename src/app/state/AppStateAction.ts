import { none, some } from "fp-ts/lib/Option"

import { apiw as getPermissions } from "async/staff/user-permissions"
import { apiw as login } from "async/authenticate-staff";
import { AppState, AppStateAction, AppStateCombined } from "./AppState";
import { logout } from "async/logout";

export function getAppStateCombined(state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>): AppStateCombined {

    const stateAction: AppStateAction = {
        setSudo: undefined,
        setBorderless: undefined,
        login: {
            setLoggedIn: undefined,
            attemptLogin: undefined,
            logout: undefined
        },
        setSudoModalOpener: undefined,
    };

    const asc: AppStateCombined = {
        state: state,
        stateAction: stateAction
    };

    const setStateP = (state: Partial<AppState>) => {
        setState((s) => ({...s, ...state}));
    };

    const setLoggedIn = (function(userName: string) {
        getPermissions().send(asc).then(res => {
            if (res.type == "Success") {
                setState((s) => ({
                    ...s,
                    login: {
                        ...s.login,
                        authenticatedUserName: some(userName),
                        permissions: res.success.reduce((hash, perm) => {
                            hash[perm] = true;
                            return hash;
                        }, {})
                    }
                }));
            } else {
                setState((s) => ({
                    ...s,
                    login: {
                        ...s.login,
                        authenticatedUserName: some(userName),
                        permissions: {}
                    }
                }));
            }
        })
        
    //	Sentry.configureScope(function(scope) {
    //		scope.setUser({"username": userName});
    //	});
    });

    
        stateAction.setSudo = (on: boolean) => setStateP({
            sudo: on
        })
        stateAction.setBorderless = () => {
            setStateP({
                borderless: true
            });
        }
        stateAction.login = {
            setLoggedIn,
            attemptLogin: (function(userName: string, password: string): Promise<boolean> {
                return login().sendJson(asc, {username: userName, password}).then(res => {
                    //console.log("done");
                    //console.log(res);
                    if (res.type == "Success") {
                        sessionStorage.setItem("authToken", res.success.token)
                        //console.log("done");
                        console.log("setLoggedIn")
                        setLoggedIn(userName)
                        return true
                    } else return false
                })
            }).bind(this),
            logout: () => {
                logout.sendJson(asc, {}).then((a) => {
                    setStateP({
                        login: {
                            authenticatedUserName: none,
                            permissions: {}
                        }
                    })
                })
            }
        }
        stateAction.setSudoModalOpener = (sudoModalOpener: () => void) => {
            setStateP({sudoModalOpener: sudoModalOpener});
        }
        /*appProps: (appProps: AppProps) => {
            asc.setState({
                appProps: appProps
            })
        }*/
    return asc;
}