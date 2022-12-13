import * as React from "react";
import Theme from "./Theme";

const Auth = ({ children }) => (
	<Theme>
		<div className="h-screen w-screen flex flex-col justify-center items-center">
			{children}
		</div>
	</Theme>
);

export default Auth;
