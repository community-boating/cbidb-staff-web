import * as React from 'react';
import { History } from 'history';
import PathWrapper, { StringObject } from './PathWrapper';
import { Route } from 'react-router';
import { PageName } from 'pages/pageNames';

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
		return <Route key={this.pathWrapper.path} path={this.pathWrapper.path} exact={this.config.exact} render={() => this.render(history)} />;
	}

	getPathFromArgs(args: T): string {
		return this.pathWrapper.getPathFromArgs(args);
	}
}