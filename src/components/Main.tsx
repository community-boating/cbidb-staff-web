import * as React from "react";

const Main = ({ className, children }) => (
	<React.Fragment>
		<div className={"main " + className}>{children}</div>

	</React.Fragment>
);

export default Main;
