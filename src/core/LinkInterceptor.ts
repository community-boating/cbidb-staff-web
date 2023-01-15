import {History} from 'history';

import RouteWrapper from './RouteWrapper';
import { canAccessPage } from "pages/accessControl";
import { StringObject } from './PathWrapper';
import { showAccessToastr, showSudoToastr } from 'components/wrapped/Toast';
import { AppStateCombined } from 'app/state/AppState';

export const linkWithAccessControl = <T extends StringObject>(
	history: History<any>,
	rw: RouteWrapper<T>,
	args: T,
	asc: AppStateCombined,
	requireSudo?: boolean,
	pathString?: string
) => {
	if (!canAccessPage(asc, rw.pageName)) {
		showAccessToastr();
	} else if (requireSudo && !asc.state.sudo) {
		showSudoToastr();
	} else {
		history.push(pathString || rw.getPathFromArgs(args))
	}
}