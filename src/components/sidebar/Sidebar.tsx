import { SideBarCategory } from "@app/SidebarCategories";
import React from "react";
import { Icon } from "react-feather";

import PerfectScrollbar from "react-perfect-scrollbar";

import useSidebar from "../../hooks/useSidebar";
import SidebarFooter from "./SidebarFooter";
import SidebarNav from "./SidebarNav";

const Sidebar: (props: {items: SideBarCategory[], showFooter?: Boolean}) => JSX.Element = ({ items, showFooter = true }) => {
	const { isOpen } = useSidebar();

	return (
		<nav className={`sidebar ${!isOpen ? "collapsed" : ""}`}>
			<div className="sidebar-content">
				<PerfectScrollbar>
					<a className="sidebar-brand" href="/">
						<span className="align-middle me-3">AppStack</span>
					</a>

					<SidebarNav items={items} />
					{!!showFooter && <SidebarFooter />}
				</PerfectScrollbar>
			</div>
		</nav>
	);
};

export default Sidebar;
