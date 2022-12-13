import * as React from "react";

import Content from "../components/Content";
import Theme from "./Theme";

export const BorderlessLayout = ({ history, children }) => (
	<Theme>
		<Content>{children}</Content>
	</Theme>
);
