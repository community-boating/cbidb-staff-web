import {History} from 'history';
import { toastr } from "react-redux-toastr";

import RouteWrapper from './RouteWrapper';
import { canAccessPage } from "pages/accessControl";
import { StringObject } from './PathWrapper';

function showToastr() {
	const options = {
		timeOut: 4000,
		showCloseButton: true,
		progressBar: true,
		position: "top-right"
	};

	toastr.error(
		"Access Denied",
		"You don't have access to that page.",
		options
	);
}

export const linkWithAccessControl = <T extends StringObject>(history: History<any>, rw: RouteWrapper<T>, args: T, pathString?: string) => {
	console.log("intercepting link!")
	if (!canAccessPage(rw.pageName)) {
		showToastr();
	} else {
		history.push(pathString || rw.getPathFromArgs(args))
	}
}