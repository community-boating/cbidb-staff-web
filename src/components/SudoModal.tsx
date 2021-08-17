import asc from '@app/AppStateContainer';
import detectEnter from '@util/detectEnterPress';
import { formUpdateStateHooks } from '@util/form-update-state';
import { none, Option, some } from 'fp-ts/lib/Option';
import { toastr } from "react-redux-toastr";
import * as React from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { ButtonWrapper } from './ButtonWrapper';
import { ErrorPopup } from './ErrorPopup';

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
			console.log("logged in as ", asc.state.login.authenticatedUserName.getOrElse("noone"))
			console.log(blankForm)
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
			return asc.updateState.login.attemptLogin(formData.username.getOrElse(""), formData.password.getOrElse(""))
			.then(x => {
				if (!x) {
					updateState("password", "");
					setLoginProcessing(false);
					setValidationErrors(["Login unsuccesful."])
				} else {
					updateState("username", "");
					updateState("password", "");
					setLoginProcessing(false);
					return success();
				}
			})
		} else return Promise.resolve();
		
	};

	console.log(formData.username)

	return <Modal
		isOpen={isOpen}
		toggle={abort}
		centered
	>
		<ModalHeader toggle={abort}>
			Elevate Session
		</ModalHeader>
		<ModalBody className="text-center m-3">
			<ErrorPopup errors={validationErrors}/>
			<p className="mb-0">
				Enter your credentials to grant super powers to this session.<br />Don't forget to turn them off when you're done.
			</p>
			<br />
			<Form>
				<FormGroup row>
					<Label sm={2} className="text-sm-right">
						Username
					</Label>
					<Col sm={10}>
						<Input
							type="text"
							name="username"
							placeholder="Username"
							value={formData.username.getOrElse("")}
							onChange={event => updateState("username", event.target.value)}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label sm={2} className="text-sm-right">
						Password
					</Label>
					<Col sm={10}>
						<Input
							type="password"
							name="password"
							placeholder="Password"
							id="sudoPassword"
							value={formData.password.getOrElse("")}
							onChange={event => updateState("password", event.target.value)}
							onKeyDown={detectEnter(loginFunction)}
						/>
					</Col>
				</FormGroup>
			</Form>
		</ModalBody>
			<ModalFooter>
				<Button color="secondary" outline onClick={abort}>
					Cancel
				</Button>{" "}
				<ButtonWrapper spinnerOnClick forceSpinner={loginProcessing} onClick={loginFunction} >
					Login
				</ButtonWrapper>
			</ModalFooter>
	</Modal>;
}