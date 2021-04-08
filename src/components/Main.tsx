import * as React from "react";

const Main = ({ className, children }) => (
	<div className={"main " + className}>{children}</div>
);

export default Main;
