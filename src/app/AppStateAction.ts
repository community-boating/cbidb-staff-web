import { none, some } from "fp-ts/lib/Option"
import asc from "./AppStateContainer"

import { apiw } from "../async/authenticate-staff";
import { apiw as getPermissions } from "async/staff/user-permissions"
import { getBoatTypes, getRatings } from "async/rest/signouts-tables";

export default class AppStateAction {
    
}
export function initUpdateState() {

    asc.updateState = {
        setSudo: (on: boolean) => asc.setState({
            sudo: on
        }),
        setBorderless: () => {
            asc.setState({
                borderless: true
            });
        },
        login: {
            setLoggedIn: (function(userName: string) {
                getPermissions().send().then(res => {
                    if (res.type == "Success") {
                        asc.setState({
                            login: {
                                ...asc.state.login,
                                authenticatedUserName: some(userName),
                                permissions: res.success.reduce((hash, perm) => {
                                    hash[perm] = true;
                                    return hash;
                                }, {})
                            }
                        });
                    } else {
                        asc.setState({
                            login: {
                                ...asc.state.login,
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
                return apiw().sendFormUrlEncoded({username: userName, password}).then(res => {
                    if (res.type == "Success" && res.success) {
                        asc.updateState.login.setLoggedIn(userName);
                        return true;
                    } else return false;
                })
            }).bind(this),
            logout: () => {
                asc.setState({
                    login: {
                        authenticatedUserName: none,
                        permissions: {}
                    }
                })
            }
        },
        init: () => {
            getRatings.send().then((a) => {
                if(a.type == "Success"){
                    asc.setState({ratings: a.success});
                }else{
                    console.log("error loading ratings");
                }
            });
            getBoatTypes.send().then((a) => {
                if(a.type == "Success"){
                    asc.setState({boatTypes: a.success});
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
    }
}