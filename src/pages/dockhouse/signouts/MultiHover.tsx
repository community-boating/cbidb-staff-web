import { ReactNode } from "react";
import * as React from 'react';
import { Popover } from "@headlessui/react";
import { memoize } from "lodash";

const OPEN_STATE_CLOSED = 0;
const OPEN_STATE_HOVER = 1;
const OPEN_STATE_CLICK = 2;

var currentUID = 0;

function getUID() : string{
	currentUID += 1;
	return "ID_" + String(currentUID);
}

export class MultiHover<T_ChildProps> extends React.Component<{
	makeChildren: (props: T_ChildProps) => ReactNode,
	handleClick?: () => void,
	hoverProps: T_ChildProps,
	noMemoChildren?: boolean,
	openDisplay: ReactNode,
}, {
	id: string
}> {
	ref: React.RefObject<HTMLDivElement>;
	constructor(props) {
		super(props);
		this.state = { id: getUID()};
	}
	getChildren = memoize ((childProps: T_ChildProps) => this.props.makeChildren(childProps));
	render() {
		return (<div>
			<Popover className="z-10 mr-auto">
					{(a) => {
						return <>
							<Popover.Button>
								<a id={this.state.id}>
									{this.props.openDisplay}
								</a>
							</Popover.Button>
							<Popover.Panel className="z-10 absolute bg-white">
								{(a.open ? this.getChildren(this.props.hoverProps) : <></>)}
							</Popover.Panel>
						</>
					}}
			</Popover>
		</div>)
	}
}
