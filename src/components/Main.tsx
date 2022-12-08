import * as React from "react";

const Main = ({ className, children }) => (
	<React.Fragment>
		<div className={className}>{children}</div>

	</React.Fragment>
);

export default Main;
