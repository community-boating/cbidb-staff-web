import { History } from 'history';
import * as React from "react";
import { UserForm, validator} from "../../async/staff/get-user"
import { Card, CardHeader, CardTitle, CardBody, FormGroup, Label, Col, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Option, none, some } from 'fp-ts/lib/Option';
import FormElementInput from '../../components/form/FormElementInput';
import {formUpdateState} from '../../util/form-update-state';
import FormElementCheckbox from '../../components/form/FormElementCheckbox';
import {postWrapper} from "../../async/staff/put-user"
import { makePostJSON } from '../../core/APIWrapperUtil';
import FormElementSelect from '@components/form/FormElementSelect';
import { UserType, userTypeDisplay, userTypes } from 'models/UserType';
import { deoptionifyProps } from '@util/OptionifyObjectProps';
import { ErrorPopup } from '@components/ErrorPopup';
import { pathUsers } from '@app/paths';

type FormData = UserForm & {
	pw1: Option<string>,
	pw2: Option<string>
}

export interface Props {
	history: History<any>,
	initialFormState: UserForm
}

type State = {
	formData: FormData,
	validationErrors: string[]
}

class FormInput extends FormElementInput<FormData> {}
class FormCheckbox extends FormElementCheckbox<FormData> {}
class FormSelect extends FormElementSelect<FormData> {}

export default class UserFormPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: {
				...props.initialFormState,
				pw1: none,
				pw2: none,
				USER_TYPE: some(some(props.initialFormState.USER_TYPE.getOrElse(none).getOrElse(UserType.User)))
			},
			validationErrors: []
		}
	}

	submit() {
		const self = this;
		return postWrapper.send(makePostJSON(deoptionifyProps(self.state.formData, validator))).then(
			// api success
			ret => {
				if (ret.type == "Success") {
					self.props.history.push(pathUsers.getPathFromArgs({}))
				} else {
					window.scrollTo(0, 0);
					self.setState({
						...self.state,
						validationErrors: ret.message.split("\\n") // TODO
					});
				}
			}
		)
	}

	render() {
		const exists = this.props.initialFormState.USER_ID.isSome();
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const updateStateNullable = formUpdateState(this.state, this.setState.bind(this), "formData", true);
		const formatElement = (label: string) => (e: React.ReactNode) => <FormGroup row>
			<Label sm={2} className="text-sm-right">
				{label}
			</Label>
			<Col sm={3}>
				{e}
			</Col>
		</FormGroup>;

		return <Card>
			<CardHeader>
				<CardTitle tag="h5" style={{ margin: "0" }}>Create/Edit User</CardTitle>
			</CardHeader>
			<CardBody>
				<ErrorPopup errors={this.state.validationErrors} />
				<FormInput
					id="USER_NAME"
					disabled={exists}
					value={this.state.formData.USER_NAME}
					updateAction={updateState}
					formatElement={formatElement("Username")}
				/>
				<FormInput
					id="EMAIL"
					value={this.state.formData.EMAIL}
					updateAction={updateState}
					formatElement={formatElement("Email")}
				/>
				<FormInput
					id="NAME_FIRST"
					value={this.state.formData.NAME_FIRST.getOrElse(none)}
					updateAction={updateStateNullable}
					formatElement={formatElement("First Name")}
				/>
				<FormInput
					id="NAME_LAST"
					value={this.state.formData.NAME_LAST.getOrElse(none)}
					updateAction={updateStateNullable}
					formatElement={formatElement("Last Name")}
				/>
				<FormSelect
					id="USER_TYPE"
					value={some(this.state.formData.USER_TYPE.getOrElse(none).getOrElse(UserType.User))}
					updateAction={updateStateNullable}
					options={userTypes.map(t => ({
						key: t,
						display: userTypeDisplay(t)
					}))}
					formatElement={formatElement("Role")}
				/>
				<FormInput
					id="pw1"
					value={this.state.formData.pw1}
					isPassword
					updateAction={updateState}
					formatElement={formatElement("Set Password")}
				/>
				<FormInput
					id="pw2"
					value={this.state.formData.pw2}
					isPassword
					updateAction={updateState}
					formatElement={formatElement("Confirm Password")}
				/>
				<FormCheckbox
					id="ACTIVE"
					value={this.state.formData.ACTIVE}
					updateAction={updateState}
					formatElement={formatElement("Active")}
				/>
				<FormCheckbox
					id="HIDE_FROM_CLOSE"
					value={this.state.formData.HIDE_FROM_CLOSE}
					updateAction={updateState}
					formatElement={formatElement("Hide from Close")}
				/>
				<FormCheckbox
					id="PW_CHANGE_REQD"
					value={this.state.formData.PW_CHANGE_REQD}
					updateAction={updateState}
					formatElement={formatElement("PW Change Required")}
				/>
				<FormCheckbox
					id="LOCKED"
					value={this.state.formData.LOCKED}
					updateAction={updateState}
					formatElement={formatElement("Locked")}
				/>
				<FormGroup row>
					<Label sm={2} className="text-sm-right pt-sm-0" />
					<Col sm={10}>
						<div className="btn-list">
							<NavLink to={pathUsers.getPathFromArgs({})}><Button outline color="primary" className="mr-1">Cancel</Button></NavLink>
							<Button color="primary" onClick={this.submit.bind(this)}>Submit</Button>
						</div>
					</Col>
				</FormGroup>
			</CardBody>
		</Card>
	}
}
