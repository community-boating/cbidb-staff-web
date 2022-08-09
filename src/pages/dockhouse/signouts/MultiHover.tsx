import { ReactNode } from "react";
import * as React from 'react';
import { Popover } from "reactstrap";

const OPEN_STATE_CLOSED = 0;
const OPEN_STATE_HOVER = 1;
const OPEN_STATE_CLICK = 2;

var currentUID = 0;

function getUID() : string{
	currentUID += 1;
	return "ID_" + String(currentUID);
}

export class MultiHover extends React.Component<{
	makeChildren: () => ReactNode,
	handleClick?: () => void,
	noMemoChildren?: boolean,
	openDisplay: ReactNode,
}, {
	children: ReactNode,
	id: string,
	open: boolean
}> {
	ref: React.RefObject<HTMLDivElement>;
	constructor(props) {
		super(props);
		this.ref = React.createRef();
		this.state = { open: false, children: undefined, id: getUID()};
	}
	componentDidMount(): void {
		const clickHandler = function(e) {
			if(this.ref.current != null && this.state.open){
				if(!this.ref.current.contains(e.target)){
					this.setOpen(false);
				}
			}
		}.bind(this);
		document.addEventListener("click", (e) => clickHandler(e));
	}
	setOpen(open: boolean) {
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
		const useChildren = this.props.noMemoChildren === false ? this.state.children : this.props.makeChildren();
		return (<div ref={this.ref}>
			<a id={this.state.id} onClick={() => this.handleClick()} onMouseOver={() => this.setOpen(true)} onMouseOut={() => this.setOpen(false)}>
				{this.props.openDisplay}
			</a>
			<Popover placement="right" isOpen={this.state.open && useChildren !== undefined} target={this.state.id} toggle={() => this.toggleOpen}>
				{useChildren}
			</Popover>
		</div>);
	}
}
