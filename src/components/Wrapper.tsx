import * as React from "react";
import { connect } from "react-redux";

const Wrapper = ({ layout, children }) => (
	<div className={"h-[100vh] flex flex-col font-primary"}>
		{children}
	</div>
);

export default connect((store: any) => ({
	layout: store.layout
}))(Wrapper);