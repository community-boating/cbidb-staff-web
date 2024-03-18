import * as React from "react";
import { Provider } from "react-redux";
import ReduxToastr from "react-redux-toastr";

import store from "./redux/store/index";
import Routes from "./app/routing";
import {apiw as isLoggedInAsStaff} from './async/is-logged-in-as-staff';
import { AppStateContext } from "./app/state/AppStateContext"
import SudoModal from "components/SudoModal";
import { getAppStateCombined } from "app/state/AppStateAction";
import { AppState, AppStateCombined } from "app/state/AppState";
import DHProviders from "async/providers/DHProviders";
import { option } from "fp-ts";

interface Props {
	history: any
	asc: AppState
}

class App extends React.Component<Props, AppState> {
	constructor(props: Props) {
		super(props);
		this.state = props.asc;
		this.makeAppStateCombined();
		this.setState = this.setState.bind(this);
	}
	componentDidMount(): void {
		const asc = this.makeAppStateCombined();
		isLoggedInAsStaff.send(asc).then(usernameResult => {
			if (usernameResult.type == "Success") {
				asc.stateAction.login.setLoggedIn(usernameResult.success.value)
			}
		}, () => {
			// not logged in
		});
	}
	makeAppStateCombined(): AppStateCombined{
		return getAppStateCombined(this.state, this.setState);
	}
	componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<AppState>, snapshot?: any): void {
	}
	render() {
		const asc = this.makeAppStateCombined();
		return (
			<Provider store={store}>
					<AppStateContext.Provider value={asc}>
						<DHProviders>
							<Routes authenticatedUserName={/*his.state.login.authenticatedUserName*/option.some("temp")} history={this.props.history}/>
							<ReduxToastr
								timeOut={15000}
								newestOnTop={true}
								position="top-right"
								transitionIn="fadeIn"
								transitionOut="fadeOut"
								progressBar
								closeOnToastrClick
							/>
							<SudoModal />
						</DHProviders>
					</AppStateContext.Provider>
			</Provider>
		)
	}
}

export default App;
