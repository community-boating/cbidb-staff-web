import { none } from "fp-ts/lib/Option";
import * as React from "react";

import { FormElement, FormElementProps } from "./FormElement";
import { Input } from "reactstrap";

interface Props {
	disabled?: boolean,
	isPassword?: boolean
	maxLength?: number
	placeholder?: string
}

export default class FormElementInput<T> extends FormElement<T, Props & FormElementProps<T, string>, string> {
	getElement() {
		const onKeyPress = (e: React.KeyboardEvent) => {
			if (this.props.onEnter && (e.keyCode || e.which) == 13) {
				this.props.onEnter();
			}
		}
		
		const onChange = (
			this.props.updateAction
			? (ev: React.ChangeEvent<HTMLInputElement>) => this.props.updateAction(this.props.id, ev.target.value)
			: this.props.onChange
		);

		return <Input
			id={this.props.id}
			ref={this.props.innerRef}
			type={this.props.isPassword ? "password" : "text"}
			name={this.props.id}
			placeholder={this.props.placeholder}
			maxLength={this.props.maxLength || 100}
			onChange={onChange}
			onKeyPress={onKeyPress}
			disabled={this.props.disabled}
			value={(this.props.value || none).getOrElse("")}
		/>;
	}
}

