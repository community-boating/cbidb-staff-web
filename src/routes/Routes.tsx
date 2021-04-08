import * as React from "react";
import { Router, Route, Switch, Redirect } from "react-router";
import {
	sideBarRoutes,
	page as pageRoutes,
	SideBarCategory
} from "./index";

import { StandardLayout } from "../layouts/StandardLayout";
import AuthLayout from "../layouts/Auth";

import ScrollToTop from "../components/ScrollToTop";
import { Option } from "fp-ts/lib/Option";
import { History } from 'history'
import { usersEditPageRoute, usersNewPageRoute } from "../app/routes/users";

import SignIn from "../pages/SignIn";
import asc from "../app/AppStateContainer";
import { BorderlessLayout } from "../layouts/BorderlessLayout";


const authenticatedRoutes = (history: History<any>) => {
	const borderless = asc.state.borderless;
	const Layout = borderless ? BorderlessLayout : StandardLayout;
	return (
		<Route
			path="/*"
			exact
			component={() => (
				<Layout>
					<Switch>
						{[
							usersNewPageRoute.asRoute(history),
							usersEditPageRoute.asRoute(history),
						].concat(sideBarRoutes.flatMap((category, index) =>
							// category.children ? (
							// Route item with children
							category.children.map(rw => rw.asRoute(history))
							// ) : (
							//   // Route item without children
							//   <Route
							//  	 key={index}
							//  	 path={category.path}
							//  	 exact
							//  	 component={category.component}
							//   />
							// )
						))}
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
