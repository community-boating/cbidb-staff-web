
import { none } from "fp-ts/lib/Option";
import * as React from "react";

import { FormElement, FormElementProps } from "./FormElement";
import { Input, CustomInput } from "reactstrap";

interface Props {
	isPassword?: boolean
	maxLength?: number
	placeholder?: string
}

export default class FormElementCheckbox<T> extends FormElement<T, Props & FormElementProps<T, boolean>, boolean> {
	getElement() {
		console.log("rendering: ", this.props.value)
		const onKeyPress = (e: React.KeyboardEvent) => {
			if (this.props.onEnter && (e.keyCode || e.which) == 13) {
				this.props.onEnter();
			}
		}
		
		const onChange = (
			this.props.updateAction
			? (ev: React.ChangeEvent<HTMLInputElement>) => this.props.updateAction(this.props.id, ev.target.checked)
			: this.props.onChange
		);

		

		return <CustomInput
			type="checkbox"
			id={this.props.id}
			label={this.props.label}
			checked={this.props.value.getOrElse(false)}
			className="mb-2"
			onChange={onChange}
		/>;
	}
}

