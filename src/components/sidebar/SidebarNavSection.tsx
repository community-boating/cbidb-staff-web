import { SideBarCategory } from "@app/SidebarCategories";
import React from "react";

import SidebarNavList from "./SidebarNavList";

const SidebarNavSection = (props: SideBarCategory) => {
	const { name, children } = props;

	return (
		<React.Fragment>
			{name && <li className="sidebar-header">{name}</li>}
			<SidebarNavList pages={children} depth={0} />
		</React.Fragment>
	);
};

export default SidebarNavSection;
