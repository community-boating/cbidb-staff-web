import * as React from "react";

import {
	Button, ButtonProps,
} from "reactstrap";

export interface Props extends ButtonProps {
	spinnerOnClick?: boolean,
	forceSpinner?: boolean,
	onClick?: (e: React.MouseEvent<any>) => Promise<any>
	customRender?: (state: State) => React.ReactNode
	customSetClicked?: () => boolean
}

export type State = {
	clicked: boolean
}

export class ButtonWrapper extends React.Component<Props, State>{
	constructor(props) {
		super(props);
		this.state = {
			clicked: false
		}
	}
	// This is a hack and an anti-pattern, but I'm doing it anyway
	// Buttons may or may not unmount themselves, if their click action effects a page transition
	// When the api request (which determines if we transition) comes back, we might need to reset the button's state
	// Not going to require button onClick() calls to remember to reset the button only if the api came back `dont-transition`
	// Just reset the button after the onClick() does all its shit and NOOP if the onClick() happened to unmount the button
	private amMounted: boolean
	componentWillMount() {
		this.amMounted = true;
	}
	componentWillUnmount() {
		this.amMounted = false;
	}

	setClicked() {
		const startingUnclicked = !this.state.clicked;
		if (startingUnclicked && (this.props.customSetClicked == undefined || this.props.customSetClicked())) {
			this.setState({
				...this.state,
				clicked: true
			})
			return true;
		} else return false;
	}

	reset() {
		if (this.amMounted){
			this.setState({
				...this.state,
				clicked: false
			})
		}
	}

	propsForDOM = (function() {
		let ret = { ... this.props }
		delete ret.spinnerOnClick;
		delete ret.forceSpinner;
		delete ret.customRender;
		return ret;
	}.bind(this)());

	onClick(e: React.MouseEvent<any>) {
		const self = this;
		const didWork = self.setClicked();
		if (didWork || self.props.notIdempotent) {
			// Whatever happens on this click, after its done, attempt to reset the button which may or may not still exist
			self.props.onClick(e)
			.catch(err => {
				console.error("Uncaught promise reject in button onClick: ", err);
			})
			.then(self.reset.bind(self));
		}
	}

	render() {
		const defaultRender = (state: State) => {
			const spinner = <img height="14px" style={{marginTop: "-3px"}} src="/images/spinner-white.gif" />;
			const maybeSpinner = this.props.forceSpinner || (state.clicked && this.props.spinnerOnClick) ? <span>&nbsp;&nbsp;{spinner}</span> : "";
			return <>
				{this.props.children}
				{maybeSpinner}
			</>
		}
		const renderToUse = this.props.customRender || defaultRender
		return <Button {...this.propsForDOM} onClick={this.onClick.bind(this)}>
			{renderToUse(this.state)}
		</Button>
	}
}