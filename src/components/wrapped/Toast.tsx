import { toastr } from "react-redux-toastr";

export function showSudoToastr() {
	const options = {
		timeOut: 4000,
		showCloseButton: true,
		progressBar: true,
		position: "top-center",
	};

	toastr.warning(
		"Elevate Session",
		"That feature is locked, elevate session to continue.",
		options
	);
}

export function showAccessToastr() {
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