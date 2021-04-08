import * as React from "react";

import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import Footer from "../components/Footer";

export const StandardLayout = ({ children }) => (
	<React.Fragment>
		<Wrapper>
			<Sidebar />
			<Main className={null}>
				<Navbar />
				<Content>{children}</Content>
				<Footer />
			</Main>
		</Wrapper>
	</React.Fragment>
);
