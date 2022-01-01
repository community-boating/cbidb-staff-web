import asc from '@app/AppStateContainer';
import detectEnter from '@util/detectEnterPress';
import { formUpdateStateHooks } from '@util/form-update-state';
import { none, Option } from 'fp-ts/lib/Option';
import * as React from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Modal } from "react-bootstrap";

import { ButtonWrapper } from './ButtonWrapper';
import { ErrorPopup } from './ErrorPopup';
import NotyfContext from "@contexts/NotyfContext";
import { Notyf } from 'notyf';

export function showSudoToastr(notyf: Notyf) {
	notyf.open({
		type: "default",
		message:"That feature is locked, elevate session to continue.",
		duration: 4000,
		position: {
			x: "right",
			y: "top"
		},
	})
}

export default function () {
	const [isOpen, setOpen] = React.useState(false);
	const [loginProcessing, setLoginProcessing] = React.useState(false);
	const [validationErrors, setValidationErrors] = React.useState([] as string[]);
	const notyf = React.useContext(NotyfContext);

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

	console.log(formData.username)

	return <Modal
		isOpen={isOpen}
		toggle={abort}
		centered
	>
		<Modal.Header>
			Elevate Session
		</Modal.Header>
		<Modal.Body className="text-center m-3">
			<ErrorPopup errors={validationErrors}/>
			<p className="mb-0">
				Enter your credentials to grant super powers to this session.<br />Don't forget to turn them off when you're done.
			</p>
			<br />
			<Form>
				<Form.Group>
					<Form.Label sm={2} className="text-sm-right">
						Username
					</Form.Label>
					<Col sm={10}>
						<Form.Control
							type="text"
							name="username"
							placeholder="Username"
							value={formData.username.getOrElse("")}
							onChange={event => updateState("username", event.target.value)}
						/>
					</Col>
				</Form.Group>
				<Form.Group>
					<Form.Label sm={2} className="text-sm-right">
						Password
					</Form.Label>
					<Col sm={10}>
						<Form.Control
							type="password"
							name="password"
							placeholder="Password"
							id="sudoPassword"
							value={formData.password.getOrElse("")}
							onChange={event => updateState("password", event.target.value)}
							onKeyDown={detectEnter(loginFunction)}
						/>
					</Col>
				</Form.Group>
			</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="secondary" onClick={abort}>
				Cancel
			</Button>{" "}
			<ButtonWrapper spinnerOnClick forceSpinner={loginProcessing} onClick={loginFunction} >
				Login
			</ButtonWrapper>
		</Modal.Footer>
	</Modal>;
}