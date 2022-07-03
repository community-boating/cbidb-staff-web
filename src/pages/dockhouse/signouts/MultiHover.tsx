import { ReactNode } from "react";
import * as React from 'react';
import { Popover } from "reactstrap";

export class MultiHover extends React.Component<{
	makeChildren: () => ReactNode,
	id: string,
	openDisplay: ReactNode,
	closeOthers: ((id: string) => void)[]
}, {
	children: ReactNode,
	open: boolean
}> {
	constructor(props) {
		super(props);
		this.state = { open: false, children: undefined };
		this.props.closeOthers.push((id: string) => {
			if (id != this.props.id) {
				if (this.state.open) {
					this.setOpen(false);
				}
			}
		});
	}
	setOpen(open: boolean) {
		if (open) {
			this.props.closeOthers.forEach((a) => {
				a(this.props.id);
			});
		}
		if (open && this.state.children == undefined) {
			this.setState({
				children: this.props.makeChildren(),
				open: open
			});
		} else {
			this.setState({
				...this.state,
				open: open
			});
		}
	}
	toggleOpen() {
		this.setOpen(!this.state.open);
	}
	render() {
		return (<>
			<a id={this.props.id} onClick={() => this.toggleOpen} onMouseOver={() => this.setOpen(true)} onMouseOut={() => this.setOpen(true)}>
				{this.props.openDisplay}
			</a>
			<Popover placement="right" isOpen={this.state.open} target={this.props.id} toggle={() => this.toggleOpen()}>
				{this.state.children || ""}
			</Popover>
		</>);
	}
}
