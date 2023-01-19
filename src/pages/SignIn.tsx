import * as React from "react";

import { none, Option, some } from "fp-ts/lib/Option";
import {formUpdateState} from "../util/form-update-state";
import detectEnter from "../util/detectEnterPress";

import cbiLogo from "../assets/img/icons/boat.svg"
import { ErrorPopup } from "components/ErrorPopup";
import Button from "components/wrapped/Button";
import { AppStateContext } from "app/state/AppStateContext";
import { AppStateCombined } from "app/state/AppState";
import { SimpleInput } from "components/wrapped/Input";

export const formDefault = {
	username: none as Option<string>,
	password: none as Option<string>
}

type State = {
	formData: typeof formDefault,
	validationErrors: string[],
	loginProcessing: boolean
};

class SignIn extends React.PureComponent<{}, State, string> {
	context: AppStateCombined;
	constructor(props) {
		super(props)
		this.state = {
			formData: formDefault,
			validationErrors: [],
			loginProcessing: false
		}
	}
	componentDidMount() {
		document.getElementById("username").focus()
	}
	render() {
		const self = this;
		const loginFunction = () => {
			const self = this;
			if (!self.state.loginProcessing) {
				self.setState({
					...this.state,
					loginProcessing: true,
					validationErrors: []
				})
				return this.context.stateAction.login.attemptLogin(self.state.formData.username.getOrElse(""), self.state.formData.password.getOrElse(""))
				.then(x => {
					if (!x) {
						self.setState({
							...self.state,
							formData: {
								...self.state.formData,
								password: none
							},
							loginProcessing: false,
							validationErrors: ["Login unsuccesful."]
						})
					} else {
						self.setState({
							...self.state,
							formData: {
								...self.state.formData,
								password: none
							},
							loginProcessing: false,
						})
					}
				})
			}
			return Promise.resolve();
		};

		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		return (
			<React.Fragment>
				<div className="text-center mt-4">
					<h1 className="text-2xl">Community Boating, Inc.</h1>
					<p className="lead">Dock House</p>
				</div>
				<div className="flex flex-col items-center justify-center my-auto bg-gray-100 p-card">
						<img

							src={cbiLogo}
							className="img-fluid rounded-circle inline"
							width="132"
							height="132"
						/>
					<ErrorPopup errors={self.state.validationErrors} />
					<SimpleInput
						label="Username"
						type="text"
						name="username"
						id="username"
						placeholder="Enter your username"
						controlledValue={self.state.formData.username.getOrElse("")}
						updateValue={v => updateState("username", v)}
					/>
					<br />
					<SimpleInput
						label="Password"
						type="password"
						name="password"
						placeholder="Enter your password"
						controlledValue={self.state.formData.password.getOrElse("")}
						updateValue={v => {
							self.setState({
								...self.state,
								formData: {
									...self.state.formData,
									password: v == "" ? none : some(v)
								}
							})
						}}
						onKeyDown={detectEnter(loginFunction)}
					/>
					<div className="text-center mt-3">
						<Button
							submit={loginFunction}
							spinnerOnClick
							forceSpinner={(this.state || {}).loginProcessing}
						>
							Sign in
						</Button>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

SignIn.contextType=AppStateContext;

export default SignIn;
