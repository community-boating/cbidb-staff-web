import * as React from "react";

import Wrapper from "../components/Wrapper";
import Main from "../components/Main";
import Content from "../components/Content";

export const BorderlessLayout = ({ history, children }) => (
	<React.Fragment>
		<Wrapper>
			<Main className={null}>
				<Content>{children}</Content>
			</Main>
		</Wrapper>
	</React.Fragment>
);
