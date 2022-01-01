import * as React from "react";
import { Provider } from "react-redux";

import store from "./redux/store/index";
import Routes from "./app/routing";
import asc from "./app/AppStateContainer";
import {apiw as isLoggedInAsStaff} from './async/is-logged-in-as-staff';
import {AppStateContainer} from "./app/AppStateContainer"
import SudoModal from "@components/SudoModal";

interface Props {
	history: any
	asc: AppStateContainer
}

class App extends React.Component<Props> {
	constructor(props: Props) {
		super(props);
		const self = this;
		asc.setListener(() => {
			console.log("forcing app to update")
			self.forceUpdate();
		})
		isLoggedInAsStaff.send(null).then(usernameResult => {
			console.log("is logged in came back....", usernameResult)
			if (usernameResult.type == "Success") {
				console.log("SETTING LOGGED IN:   " + usernameResult.success.value)
				asc.updateState.login.setLoggedIn(usernameResult.success.value)
			}
		}, () => {
			// not logged in
		});
	}
	render() {
		return (
			<Provider store={store}>
				<Routes authenticatedUserName={asc.state.login.authenticatedUserName} history={this.props.history}/>
				<SudoModal />
			</Provider>
		)
	}
}

export default App;
