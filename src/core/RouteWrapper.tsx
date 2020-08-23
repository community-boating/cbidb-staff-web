import * as React from 'react';
import { History } from 'history';
import PathWrapper, { StringObject } from './PathWrapper';
import { Route } from 'react-router';

export default class RouteWrapper<T extends StringObject>{
	constructor(
		public requiresAuth: boolean,
		public pathWrapper: PathWrapper<T>,
		public render: (history: History<any>) => JSX.Element
	) {}

	asRoute(history: History<any>) {
		return <Route key={this.pathWrapper.path} path={this.pathWrapper.path} render={() => this.render(history)} />;
	}

	getPathFromArgs(args: T): string {
		return this.pathWrapper.getPathFromArgs(args);
	}
}