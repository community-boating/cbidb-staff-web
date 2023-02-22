import * as React from "react";

import Header from "../components/dockhouse/Header";
import Content from "../components/Content";
import Theme from "./Theme";

export const StandardLayout = ({ history, children }) => (
	<Theme>
		<span className="h-screen w-screen flex flex-col font-primary px-primary my-theme bg-background">
			<Header history={history}/>
			<Content>{children}</Content>
		</span>
	</Theme>
);
