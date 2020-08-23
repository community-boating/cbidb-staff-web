import { History } from "history";
import * as React from "react";

import { DoublyLinkedList } from "../util/DoublyLinkedList";

export interface ComponentPropsFromWizard {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	prevNodes: WizardNode[],
	currNode: WizardNode,
	nextNodes: WizardNode[],
	wizard: WizardPageflow
}

export interface WizardNode {
	clazz: (fromWizard: ComponentPropsFromWizard) => JSX.Element,
	breadcrumbHTML?: JSX.Element
}

export type ElementDLL = DoublyLinkedList<() => JSX.Element>


interface Props {
	history: History<any>,
	nodes: WizardNode[],
	start: string,
	end: string,
}

interface State {
	dll: ElementDLL
}

export default class WizardPageflow extends React.Component<Props, State> {
	// personId: number
	goNext: () => Promise<void>
	goPrev: () => Promise<void>
	static getNextDLL: (dll: ElementDLL) => ElementDLL = dll => dll.next()
	static getPrevDLL: (dll: ElementDLL) => ElementDLL = dll => dll.prev()
	pushNewDLL(dll: ElementDLL) {
		this.setState({
			...this.state,
			dll
		})
	}
	constructor(props: Props) {
		super(props)
		const self = this
		
		this.goNext = () => {
			if (self.state.dll.hasNext()) {
				self.setState({
					...self.state,
					dll: self.state.dll.next()
				})
			} else {
				self.props.history.push(self.props.end);
			}
			return Promise.resolve();
		}

		this.goPrev = () => {
			if (self.state.dll.hasPrev()) {
				self.setState({
					...self.state,
					dll: self.state.dll.prev()
				})
			} else {
				self.props.history.push(self.props.start);
			}
			return Promise.resolve();
		}

		const nodes = self.props.nodes.map((node, i, arr) => {
			const prevNodes = arr.filter((ee, ii) => ii < i)
			const nextNodes = arr.filter((ee, ii) => ii > i)
			return () => node.clazz({
				goNext: self.goNext.bind(self),
				goPrev: self.goPrev.bind(self),
				prevNodes,
				nextNodes,
				currNode: node,
				wizard: self
			})
		})

		this.state = {
			dll: DoublyLinkedList.from(nodes)
		}
	}
	render() {
		return this.state.dll.curr()
	}
}
