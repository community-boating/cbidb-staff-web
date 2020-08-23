import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  sideBarRoutes,
  page as pageRoutes,
  SideBarCategory
} from "./index";

import {StandardLayout} from "../layouts/StandardLayout";
import AuthLayout from "../layouts/Auth";

import ScrollToTop from "../components/ScrollToTop";
import { Option } from "fp-ts/lib/Option";
import {History} from 'history'

import SignIn from "../pages/auth/SignIn";

const authenticatedRoutes = (history: History<any>) => (
	<Route
		path="/*"
		exact
		component={() => (
			<StandardLayout>
			<Switch>
			  {sideBarRoutes.map((category, index) =>
				// category.children ? (
				  // Route item with children
				  category.children.map(rw => rw.asRoute(history))
				// ) : (
				//   // Route item without children
				//   <Route
				//     key={index}
				//     path={category.path}
				//     exact
				//     component={category.component}
				//   />
				// )
			  )}
			</Switch>
		  </StandardLayout>
		)}
	/>
)

const Routes = (props: {authenticatedUserName: Option<string>, history: History<any>}) => (
  <Router>
    <ScrollToTop>
      <Switch>
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
