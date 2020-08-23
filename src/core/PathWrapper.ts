import { matchPath } from 'react-router-dom';

export type StringObject = { [K: string]: string };

export default class PathWrapper<T extends StringObject> {
	public path: string;

	static removeLeadingTrailingSlashes(path: string): string {
		return path.replace(/^\/+|\/+$/g, '');
	}
	constructor(
		path: string
	) {
		// remove leading or trailing slashes
		this.path = '/' + PathWrapper.removeLeadingTrailingSlashes(path);
	}

	extractURLParams(location: string): T {
		const match = matchPath(
			location,
			{ path: this.path }
		) || { params: {} };
		return match.params as T;
	}

	appendPathSegment<T_NewProps extends StringObject>(subPath: string) {
		return new PathWrapper<T & T_NewProps>(this.path + '/' + PathWrapper.removeLeadingTrailingSlashes(subPath))
	}

	getPathFromArgs(args: T): string {
		const keys = Object.keys(args);
		return keys.reduce((path, key) => {
			const regex = new RegExp(':' + key, 'g');
			return path.replace(regex, args[key]);
		}, this.path);
	}
}