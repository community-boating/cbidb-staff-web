import { SideBarCategory } from "@app/SidebarCategories";
import React from "react";

import SidebarNavSection from "./SidebarNavSection";

const SidebarNav: (props: {items: SideBarCategory[]}) => JSX.Element = ({ items }) => {
	return (
		<ul className="sidebar-nav">
			{items &&
				items.map((item) => (
					<SidebarNavSection
						key={item.name}
						children={item.children}
						name={item.name}
						path={item.path}
						icon={item.icon}
					/>
				))}
		</ul>
	);
};

export default SidebarNav;
