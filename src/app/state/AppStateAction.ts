import { none, some } from "fp-ts/lib/Option"

import { showSudoToastr } from 'components/wrapped/Toast';

import { apiw as getPermissions } from "async/staff/user-permissions"
import { apiw as login } from "async/authenticate-staff";
import { getBoatTypes, getRatings } from "async/staff/dockhouse/signouts-tables";
import { AppState, AppStateAction, AppStateCombined } from "./AppState";

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
        initAfterLogin: undefined
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
        }),
        stateAction.setBorderless = () => {
            setStateP({
                borderless: true
            });
        },
        stateAction.login = {
            setLoggedIn,
            attemptLogin: (function(userName: string, password: string): Promise<boolean> {
                return login().sendFormUrlEncoded(asc, {username: userName, password}).then(res => {
                    if (res.type == "Success" && res.success) {
                        setLoggedIn(userName);
                        return true;
                    } else return false;
                })
            }).bind(this),
            logout: () => {
                setStateP({
                    login: {
                        authenticatedUserName: none,
                        permissions: {}
                    }
                })
            }
        },
        stateAction.setSudoModalOpener = (sudoModalOpener: () => void) => {
            setStateP({sudoModalOpener: sudoModalOpener});
        },
        stateAction.initAfterLogin = () => {
            getRatings.send(asc).then((a) => {
                if(a.type == "Success"){
                    setStateP({ratings: a.success});
                }else{
                    console.log("error loading ratings");
                }
            });
            getBoatTypes.send(asc).then((a) => {
                if(a.type == "Success"){
                    setStateP({boatTypes: a.success});
                }else{
                    console.log("error loading boat types");
                }
            });
        }
        /*appProps: (appProps: AppProps) => {
            asc.setState({
                appProps: appProps
            })
        }*/
    return asc;
}