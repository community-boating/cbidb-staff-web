import {History} from 'history';

import RouteWrapper from './RouteWrapper';
import { canAccessPage } from "pages/accessControl";
import { StringObject } from './PathWrapper';
import asc from 'app/AppStateContainer';
import { showAccessToastr, showSudoToastr } from 'components/wrapped/Toast';

export const linkWithAccessControl = <T extends StringObject>(
	history: History<any>,
	rw: RouteWrapper<T>,
	args: T,
	requireSudo?: boolean,
	pathString?: string
) => {
	if (!canAccessPage(rw.pageName)) {
		showAccessToastr();
	} else if (requireSudo && !asc.state.sudo) {
		showSudoToastr();
	} else {
		history.push(pathString || rw.getPathFromArgs(args))
	}
}