import { ReactNode } from "react";
import * as React from 'react';
import { Popover } from "reactstrap";

const OPEN_STATE_CLOSED = 0;
const OPEN_STATE_HOVER = 1;
const OPEN_STATE_CLICK = 2;

export class MultiHover extends React.Component<{
	makeChildren: () => ReactNode,
	handleClick?: () => void,
	id: string,
	noMemoChildren?: boolean,
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
		if (this.state.children == undefined) {
			const newChildren = this.props.makeChildren();
			this.setState({
				children: newChildren,
				open: newChildren !== undefined
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
	handleClick(){
		this.toggleOpen();
		if(this.props.handleClick !== undefined){
			this.props.handleClick();
		}
	}
	render() {
		return (<>
			<a id={this.props.id} onClick={() => this.handleClick()} onMouseOver={() => this.setOpen(true)} onMouseOut={() => this.setOpen(false)}>
				{this.props.openDisplay}
			</a>
			<Popover placement="right" isOpen={this.state.open} target={this.props.id} toggle={() => this.toggleOpen}>
				{this.props.noMemoChildren === false ? this.state.children : this.props.makeChildren() || ""}
			</Popover>
		</>);
	}
}
