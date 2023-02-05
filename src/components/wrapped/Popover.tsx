import { ReactNode } from "react";
import * as React from 'react';
import { Popover as PopoverHUI } from "@headlessui/react";
import { memoize } from "lodash";

const OPEN_STATE_CLOSED = 0;
const OPEN_STATE_HOVER = 1;
const OPEN_STATE_CLICK = 2;

var currentUID = 0;

function getUID() : string{
	currentUID += 1;
	return "ID_" + String(currentUID);
}

export class Popover<T_ChildProps> extends React.Component<{
	makeChildren: (props: T_ChildProps) => ReactNode
	handleClick?: () => void
	hoverProps: T_ChildProps
	noMemoChildren?: boolean
	openDisplay: ReactNode
	className?: string
}, {
	id: string
	open: boolean
}> {
	ref: React.RefObject<HTMLDivElement>;
	constructor(props) {
		super(props);
		this.state = { id: getUID(), open: false};
	}
	getChildren = memoize ((childProps: T_ChildProps) => this.props.makeChildren(childProps));
	render() {
		const toggleOpen = () => this.setState((s) => ({...s, open: !s.open}));
		const setOpen = (open) => this.setState((s) => ({...s, open: open}));
		return (<div onMouseLeave={() => {
			setOpen(false);
		}}>
			<PopoverHUI className={"z-10 mr-auto"}>
					{(a) => {
						return <>
							<PopoverHUI.Button className="max-w-full" onMouseEnter={() => {
								setOpen(true);
							}}
							onClick={(e) => {
								console.log(e);
								console.log("setting");
								toggleOpen();
							}}>
								<a id={this.state.id}>
									{this.props.openDisplay}
								</a>
							</PopoverHUI.Button>
							<PopoverHUI.Panel className="z-10 absolute bg-white mx-auto" static>
								{(this.state.open ? this.getChildren(this.props.hoverProps) : <></>)}
							</PopoverHUI.Panel>
						</>
					}}
			</PopoverHUI>
		</div>)
	}
}
