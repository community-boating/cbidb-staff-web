import * as React from "react";
import { Router, Route, Switch, Redirect } from "react-router";
import {
	dhRoutes,
} from "./routes/routes";

import { StandardLayout } from "../layouts/StandardLayout";
import AuthLayout from "../layouts/Auth";

import ScrollToTop from "../components/ScrollToTop";
import { Option } from "fp-ts/lib/Option";
import { History } from 'history'

import SignIn from "../pages/SignIn";
import { BorderlessLayout } from "../layouts/BorderlessLayout";
import { AppStateCombined } from "./state/AppState";
import { AppStateContext } from "./state/AppStateContext";

const authenticatedRoutes = (asc: AppStateCombined,history: History<any>) => {


	//TODO CHANGEFORFULLMODE
	const borderless = true;//asc.state.borderless;
	const Layout = borderless ? BorderlessLayout : StandardLayout;
	const routes = dhRoutes.filter(r => !r.requireSudo || asc.state.sudo)
	.map(r => r.asRoute(asc, history));
	return (
		<Route
			path="/*"
			exact
			component={() => (
				<Layout history={history}>
					<Switch>
						{routes}
						<Redirect from="*" to="/dh/fotv-controller"/>
					</Switch>
				</Layout>
			)}
		/>
	);
}

const Routes = (props: { authenticatedUserName: Option<string>, history: History<any> }) => {
	const asc = React.useContext(AppStateContext);
	return <Router history={props.history}>
		<ScrollToTop>
			<Switch>
				<Route path="/borderless" component={() => {
					const path = props.history.location.pathname;
					const regex = /^\/borderless\/(.*)$/;
					const result = regex.exec(path);
					asc.stateAction.setBorderless();
					return <Redirect to={'/' + result[1]} />
				}} />
				{props.authenticatedUserName.isSome()
					? authenticatedRoutes(asc, props.history)
					: <Route component={() => (
						<AuthLayout>
							<SignIn />
						</AuthLayout>
					)} />
				}
			</Switch>
		</ScrollToTop>
	</Router>
};

export default Routes;
