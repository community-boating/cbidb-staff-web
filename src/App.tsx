import * as React from "react";
import { Provider } from "react-redux";
import ReduxToastr from "react-redux-toastr";

import store from "./redux/store/index";
import Routes from "./routes/Routes";
import asc from "./app/AppStateContainer";
import {apiw as isLoggedInAsStaff} from './async/is-logged-in-as-staff';
import {AppStateContainer} from "./app/AppStateContainer"

interface Props {
	history: any
	asc: AppStateContainer
}

class App extends React.Component<Props> {
	constructor(props) {
		super(props);
		const self = this;
		asc.setListener(() => {
			self.forceUpdate();
		})
		isLoggedInAsStaff.send(null).then(usernameResult => {
			console.log("is logged in came back....", usernameResult)
			if (usernameResult.type == "Success") {
				console.log("SETTING LOGGED IN:   " + usernameResult.success.value)
				asc.updateState.login.setLoggedIn(usernameResult.success)
			}
		}, () => {
			// not logged in
		})
	}
	render() {
		return (
			<Provider store={store}>
				<Routes authenticatedUserName={asc.state.login.authenticatedUserName} history={this.props.history}/>
				<ReduxToastr
					timeOut={5000}
					newestOnTop={true}
					position="top-right"
					transitionIn="fadeIn"
					transitionOut="fadeOut"
					progressBar
					closeOnToastrClick
				/>
			</Provider>
		)
	}
}

export default App;
