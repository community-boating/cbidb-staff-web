import { none } from "fp-ts/lib/Option";
import * as React from "react";

import { FormElement, FormElementProps } from "./FormElement";
import { Input } from "reactstrap";

interface Props {
	disabled?: boolean
	options: KeyAndDisplay[],
	nullDisplay?: string
}

export type KeyAndDisplay = {
	key: string,
	display: string
}

export default class FormElementSelect<T> extends FormElement<T, Props & FormElementProps<T, string>, string> {
	getElement() {
		const onChange = (
			this.props.updateAction
			? (ev: React.ChangeEvent<HTMLInputElement>) => this.props.updateAction(this.props.id, ev.target.value)
			: this.props.onChange
		);

		const nullOption: React.ReactNode[] = this.props.nullDisplay === undefined
		? []
		: [<option key={null} value="">{this.props.nullDisplay}</option>];

		return <Input
			type="select"
			id={this.props.id}
			ref={this.props.innerRef}
			name={this.props.id}
			onChange={onChange}
			disabled={this.props.disabled}
			value={(this.props.value || none).getOrElse("")}
		>
			{nullOption.concat(this.props.options.map(({key, display}) => <option value={key} key={key}>{display}</option>))}
		</Input>;
	}
}

