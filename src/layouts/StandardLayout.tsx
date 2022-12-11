import * as React from "react";

import Wrapper from "../components/Wrapper";
import Header from "../components/dockhouse/Header";
import Content from "../components/Content";

export const StandardLayout = ({ history, children }) => (
	<React.Fragment>
		<Wrapper>
			<Header history={history}/>
			<Content>{children}</Content>
		</Wrapper>
	</React.Fragment>
);
