import asc from 'app/AppStateContainer';
import detectEnter from 'util/detectEnterPress';
import { formUpdateStateHooks } from 'util/form-update-state';
import { none, Option } from 'fp-ts/lib/Option';
import { toastr } from "react-redux-toastr";
import * as React from 'react';

import { ErrorPopup } from './ErrorPopup';
import Modal, { ModalHeader } from './wrapped/Modal';
import Button from './wrapped/Button';
import { Input } from './wrapped/Input';

export default function () {
	const [isOpen, setOpen] = React.useState(false);
	const [loginProcessing, setLoginProcessing] = React.useState(false);
	const [validationErrors, setValidationErrors] = React.useState([] as string[]);

	const blankForm = {
		username: none as Option<string>,
		password: none as Option<string>,
	}
	const [formData, setFormData] = React.useState(blankForm);
	
	const updateState = formUpdateStateHooks(formData, setFormData);

	asc.setSudoModalOpener(function () {
		setOpen(true);
		setTimeout(() => {
			setFormData({
				username: asc.state.login.authenticatedUserName,
				password: none
			});
			const node = document.getElementById("sudoPassword");
			node && node.focus();
		}, 50)
	});

	const abort = () => {
		setOpen(false);
	}

	const success = () => {
		setOpen(false);
		asc.updateState.setSudo(true);
		return Promise.resolve();
	}

	const loginFunction = () => {
		if (!loginProcessing) {
			setLoginProcessing(true);
			setValidationErrors([]);
			const username = formData.username.getOrElse("");
			return asc.updateState.login.attemptLogin(username, formData.password.getOrElse(""))
			.then(loginSuccessful => {
				updateState("password", "");
				setLoginProcessing(false);
				if (loginSuccessful) {
					updateState("username", "");
					return success();
				} else {
					setValidationErrors(["Login unsuccesful."])
				}
			})
		} else return Promise.resolve();
		
	};

	return <Modal
		open={isOpen}
		setOpen={setOpen}
		className="bg-gray-100 rounded-lg"
	>
		<ModalHeader><h1>Elevate Session</h1></ModalHeader>
		<div className="w-[50vh] h-[50vh] flex flex-col">
			<ErrorPopup errors={validationErrors}/>
			<p className="mb-0">
				Enter your credentials to grant super powers to this session.<br />Don't forget to turn them off when you're done.
			</p>
			<br />
			<div className="self-center my-auto">
						<Input
							label="Username:"
							type="text"
							name="username"
							placeholder="Username"
							value={formData.username.getOrElse("")}
							onChange={event => updateState("username", event.target.value)}
						/>
						<Input
							label="Password:"
							type="password"
							name="password"
							placeholder="Password"
							id="sudoPassword"
							value={formData.password.getOrElse("")}
							onChange={event => updateState("password", event.target.value)}
							onKeyDown={detectEnter(loginFunction)}
						/>
		</div>
			<div className="mt-auto mb-0 flex flex-row">
				<Button onClick={abort}>
					Cancel
				</Button>
				<Button className="ml-auto mr-0" spinnerOnClick forceSpinner={loginProcessing} onClick={loginFunction} >
					<p>Login</p>
				</Button>
			</div>
		</div>
	</Modal>;
}