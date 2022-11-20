import * as React from "react";

import Wrapper from "../components/Wrapper";
import Main from "../components/Main";
import Navbar from "../components/NavHeader";
import Content from "../components/Content";
import Footer from "../components/Footer";

export const StandardLayout = ({ history, children }) => (
	<React.Fragment>
		<Wrapper>
			<Main className={"default"}>
				<Navbar history={history}/>
				<Content>{children}</Content>
				<Footer />
			</Main>
		</Wrapper>
	</React.Fragment>
);
