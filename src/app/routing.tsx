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
import asc from "./AppStateContainer";
import { BorderlessLayout } from "../layouts/BorderlessLayout";


const authenticatedRoutes = (history: History<any>) => {
	const borderless = asc.state.borderless;
	const Layout = borderless ? BorderlessLayout : StandardLayout;
	const routes = dhRoutes.filter(r => !r.requireSudo || asc.state.sudo)
	.map(r => r.asRoute(history));
	return (
		<Route
			path="/*"
			exact
			component={() => (
				<Layout history={history}>
					<Switch>
						{routes}
					</Switch>
				</Layout>
			)}
		/>
	);
}

const Routes = (props: { authenticatedUserName: Option<string>, history: History<any> }) => (
	<Router history={props.history}>
		<ScrollToTop>
			<Switch>
				<Route path="/borderless" component={() => {
					const path = props.history.location.pathname;
					const regex = /^\/borderless\/(.*)$/;
					const result = regex.exec(path);
					asc.updateState.setBorderless();
					return <Redirect to={'/' + result[1]} />
				}} />
				{props.authenticatedUserName.isSome()
					? authenticatedRoutes(props.history)
					: <Route component={() => (
						<AuthLayout>
							<SignIn />
						</AuthLayout>
					)} />
				}
			</Switch>
		</ScrollToTop>
	</Router>
);

export default Routes;
