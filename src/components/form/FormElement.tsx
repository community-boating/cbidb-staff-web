import * as React from "react";
import { Option } from "fp-ts/lib/Option";

export interface FormElementProps<T_Form, T_ValueType> {
	id: string & keyof T_Form,
	value: Option<T_ValueType>,
	label?: string | JSX.Element,
	extraCells?: React.ReactNode,
	innerRef?: React.RefObject<any>,
	prependToElementCell?: React.ReactNode,
	appendToElementCell?: React.ReactNode,
	onChange?: (event: React.ChangeEvent) => void,
	onEnter?: () => void,
	updateAction?: (name: string, value: T_ValueType) => void,
	isRequired?: boolean,
	formatElement?: (el: React.ReactNode) => React.ReactNode
}

export abstract class FormElement<T_Form, T_OwnProps, T_ValueType> extends React.PureComponent<T_OwnProps & FormElementProps<T_Form, T_ValueType>> {
	abstract getElement(): React.ReactNode;
	
	render() {
		if (this.props.formatElement) {
			return this.props.formatElement(this.getElement());
		} else {
			return this.getElement();
		}
	}
}

