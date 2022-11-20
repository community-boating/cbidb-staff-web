import * as React from 'react';
import { History } from 'history';
import PathWrapper, { StringObject } from './PathWrapper';
import { Redirect, Route } from 'react-router';
import { PageName } from 'pages/pageNames';
import { canAccessPage } from 'pages/accessControl';

export type RouteWrapperConfig<T extends StringObject> = {
	navTitle?: string,
	navOrder?: number,
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
	navTitle = this.config.navTitle;
	navOrder = this.config.navOrder;

	public pageName = this.config.pageName;
	public requireSudo = this.config.requireSudo;

	asRoute(history: History<any>) {
		if (!canAccessPage(this.config.pageName)) {
			return <Redirect key={"redirect-" + this.config.pageName} to={'/'}  />
		} else {
			return <Route key={this.pathWrapper.path} path={this.pathWrapper.path} exact={this.config.exact} render={() => this.render(history)} />;
		}
		
	}

	getPathFromArgs(args: T): string {
		return this.pathWrapper.getPathFromArgs(args);
	}
}
