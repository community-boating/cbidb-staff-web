import {History} from 'history';

import RouteWrapper from './RouteWrapper';
import { canAccessPage } from "pages/accessControl";
import { StringObject } from './PathWrapper';
import asc from '@app/AppStateContainer';
import { showSudoToastr } from '@components/SudoModal';
import React from 'react';
import { Notyf } from 'notyf';
import NotyfContext from "@contexts/NotyfContext";

function showToastr(notyf: Notyf) {
	notyf.open({
		type: "default",
		message:"Access denied.",
		duration: 4000,
		position: {
			x: "right",
			y: "top"
		},
	})
}

export const linkWithAccessControl = <T extends StringObject>(
	history: History<any>,
	rw: RouteWrapper<T>,
	args: T,
	requireSudo?: boolean,
	pathString?: string
) => {
	const notyf = React.useContext(NotyfContext);

	console.log("intercepting link!")
	if (!canAccessPage(rw.pageName)) {
		showToastr(notyf);
	} else if (requireSudo && !asc.state.sudo) {
		showSudoToastr(notyf);
	} else {
		history.push(pathString || rw.getPathFromArgs(args))
	}
}