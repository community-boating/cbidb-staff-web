import React from "react";

import Wrapper from "../components/Wrapper";
import Sidebar from "../components/sidebar/Sidebar";
import Main from "../components/Main";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import Footer from "../components/Footer";
import { sideBarRoutes } from "@app/SidebarCategories";


export const StandardLayout: React.FunctionComponent = ({ children }) => (
	<React.Fragment>
		<Wrapper>
			<Sidebar items={sideBarRoutes} />
			<Main className="">
				<Navbar />
				<Content>
					{children}
				</Content>
				<Footer />
			</Main>
		</Wrapper>
	</React.Fragment>
);
