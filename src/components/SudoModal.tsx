import detectEnter from 'util/detectEnterPress';
import { formUpdateStateHooks } from 'util/form-update-state';
import { none, Option } from 'fp-ts/lib/Option';
import { toastr } from "react-redux-toastr";
import * as React from 'react';

import { ErrorPopup } from './ErrorPopup';
import Modal, { ModalHeader } from './wrapped/Modal';
import Button from './wrapped/Button';
import { SimpleInput } from './wrapped/Input';
import { AppStateContext } from 'app/state/AppStateContext';

export default function () {
	const [isOpen, setOpen] = React.useState(false);
	const [loginProcessing, setLoginProcessing] = React.useState(false);
	const [validationErrors, setValidationErrors] = React.useState([] as string[]);
	
	const asc = React.useContext(AppStateContext);

	const blankForm = {
		username: none as Option<string>,
		password: none as Option<string>,
	}
	const [formData, setFormData] = React.useState(blankForm);
	
	const updateState = formUpdateStateHooks(formData, setFormData);
	React.useEffect(() => {
		asc.stateAction.setSudoModalOpener(() => {
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
	}, []);

	const abort = () => {
		setOpen(false);
	}

	const success = () => {
		setOpen(false);
		asc.stateAction.setSudo(true);
		return Promise.resolve();
	}

	const loginFunction = () => {
		if (!loginProcessing) {
			setLoginProcessing(true);
			setValidationErrors([]);
			const username = formData.username.getOrElse("");
			return asc.stateAction.login.attemptLogin(username, formData.password.getOrElse(""))
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
						<SimpleInput
							label="Username:"
							type="text"
							name="username"
							placeholder="Username"
							controlledValue={formData.username.getOrElse("")}
							updateValue={v => updateState("username", v)}
						/>
						<SimpleInput
							label="Password:"
							type="password"
							name="password"
							placeholder="Password"
							id="sudoPassword"
							controlledValue={formData.password.getOrElse("")}
							updateValue={v => updateState("password", v)}
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