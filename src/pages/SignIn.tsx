import * as React from "react";

import {
	Card,
	CardBody,
	Label,
	Input,
	UncontrolledAlert
} from "reactstrap";
import { none, Option, some } from "fp-ts/lib/Option";
import formUpdateState from "../util/form-update-state";
import asc from "../app/AppStateContainer";
import detectEnter from "../util/detectEnterPress";
import { ButtonWrapper } from "../components/ButtonWrapper";

const cbiLogo = require("../assets/img/CBI_boat.jpg");

export const formDefault = {
	username: none as Option<string>,
	password: none as Option<string>
}

type State = {
	formData: typeof formDefault,
	validationErrors: string[],
	loginProcessing: boolean
};

class SignIn extends React.PureComponent<{}, State> {
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
				return asc.updateState.login.attemptLogin(self.state.formData.username.getOrElse(""), self.state.formData.password.getOrElse(""))
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
					}
				})
			}
			else return Promise.resolve();
		};

		const errorDiv = <UncontrolledAlert color="warning" key="login-error">
			<div className="alert-message">
				<ul style={{margin: "0"}}>
					{self.state.validationErrors.map((v, i) => <li key={`validation-err-${i}`}>{v}</li>)}
				</ul>
			</div>
		</UncontrolledAlert>;

		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		return (
			<React.Fragment>
				<div className="text-center mt-4">
					<h2>Community Boating, Inc.</h2>
					<p className="lead">Front Office</p>
				</div>

				<Card>
					<CardBody>
						<div className="m-sm-4">
							<div className="text-center" style={{ marginBottom: "20px" }}>
								<img
									src={cbiLogo}
									className="img-fluid rounded-circle"
									width="132"
									height="132"
								/>
							</div>
							{self.state.validationErrors.length > 0 ? errorDiv : null}
							<Label>Username</Label>
							<Input
								bsSize="lg"
								type="text"
								name="username"
								id="username"
								placeholder="Enter your username"
								value={self.state.formData.username.getOrElse("")}
								onChange={event => updateState("username", event.target.value)}
							/>
							<br />
							<Label>Password</Label>
							<Input
								bsSize="lg"
								type="password"
								name="password"
								placeholder="Enter your password"
								value={self.state.formData.password.getOrElse("")}
								onChange={event => {
									self.setState({
										...self.state,
										formData: {
											...self.state.formData,
											password: event.target.value == "" ? none : some(event.target.value)
										}
									})
								}}
								onKeyDown={detectEnter(loginFunction)}
							/>
							<div className="text-center mt-3">
								<ButtonWrapper
									color="primary"
									size="lg"
									onClick={loginFunction}
									spinnerOnClick
									forceSpinner={(this.state || {}).loginProcessing}
								>
									Sign in
								</ButtonWrapper>
							</div>
						</div>
					</CardBody>
				</Card>
			</React.Fragment>
		);
	}
}

export default SignIn;
