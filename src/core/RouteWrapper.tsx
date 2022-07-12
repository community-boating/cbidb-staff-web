import * as React from 'react';
import { History } from 'history';
import PathWrapper, { StringObject } from './PathWrapper';
import { Redirect, Route } from 'react-router';
import { PageName } from 'pages/pageNames';
import { canAccessPage } from 'pages/accessControl';

export type RouteWrapperConfig<T extends StringObject> = {
	sidebarTitle?: string,
	requiresAuth: boolean,
	exact: boolean,
	pathWrapper: PathWrapper<T>,
	pageName: PageName,
	requireSudo?: boolean,
}

export default class RouteWrapper<T extends StringObject>{
	constructor(
		private config: RouteWrapperConfig<T>,
		public render: (history: History<any>) => JSX.Element
	) {}

	pathWrapper = this.config.pathWrapper;
	sidebarTitle = this.config.sidebarTitle;

	public pageName = this.config.pageName;
	public requireSudo = this.config.requireSudo;

	asRoute(history: History<any>) {
		if (!canAccessPage(this.config.pageName)) {
			return <Redirect key={"redirect-" + this.config.pageName} path={this.config.pageName} to={'/'}  />
		} else {
			return <Route key={this.pathWrapper.path} path={this.pathWrapper.path} exact={false} render={() => {console.log("rendering"); return this.render(history)}} />;
		}
		
	}

	getPathFromArgs(args: T): string {
		return this.pathWrapper.getPathFromArgs(args);
	}
}
