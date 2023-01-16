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

interface Props {
	history: any
	asc: AppState
}

class App extends React.Component<Props, AppState> {
	appStateCombined: AppStateCombined
	constructor(props: Props) {
		super(props);
		this.state = props.asc;
		this.setState = this.setState.bind(this);
	}
	componentDidMount(): void {
		isLoggedInAsStaff.send(this.appStateCombined).then(usernameResult => {
			if (usernameResult.type == "Success") {
				this.appStateCombined.stateAction.login.setLoggedIn(usernameResult.success.value)
				console.log("doing it");
			}
		}, () => {
			// not logged in
		});
	}
	makeAppStateCombined(){
		this.appStateCombined = getAppStateCombined(this.state, this.setState);
	}
	initAfterLogin(){
		if(!this.state.hasInit && this.state.login.authenticatedUserName.isSome()){
			this.appStateCombined.stateAction.initAfterLogin();
			this.setState((s) => ({...s, hasInit: true}));
		}
	}
	render() {
		this.makeAppStateCombined();
		this.initAfterLogin();
		return (
			<Provider store={store}>
				<AppStateContext.Provider value={this.appStateCombined}>
					<Routes authenticatedUserName={this.state.login.authenticatedUserName} history={this.props.history}/>
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
				</AppStateContext.Provider>
			</Provider>
		)
	}
}

export default App;
