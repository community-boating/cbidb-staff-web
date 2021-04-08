import * as React from "react";

import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import Footer from "../components/Footer";

export const BorderlessLayout = ({ children }) => (
	<React.Fragment>
		<Wrapper>
			<Main className={null}>
				<Content>{children}</Content>
			</Main>
		</Wrapper>
	</React.Fragment>
);
