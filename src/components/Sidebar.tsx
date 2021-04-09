import * as React from "react";
import { connect } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

import { Badge, Collapse } from "reactstrap";
import * as PerfectScrollbarAll from "react-perfect-scrollbar";

import { Box } from "react-feather";

import { sideBarRoutes } from "../app/SidebarCategories";

const SidebarCategory = ({
	name,
	icon: Icon,
	isOpen,
	children,
	onClick,
	to
}) => {
	const location = useLocation();

	const getSidebarItemClass = path => {
		return location.pathname.indexOf(path) !== -1 ||
			(location.pathname === "/" && path === "/dashboard")
			? "active"
			: "";
	};

	return (
		<li className={"sidebar-item " + getSidebarItemClass(to)}>
			<span
				data-toggle="collapse"
				className={"sidebar-link " + (!isOpen ? "collapsed" : "")}
				onClick={onClick}
				aria-expanded={isOpen ? "true" : "false"}
			>
				<Icon size={18} className="align-middle mr-3" />
				<span className="align-middle">{name}</span>
				{/* {badgeColor && badgeText ? (
				<Badge color={badgeColor} size={18} className="sidebar-badge">
					{badgeText}
				</Badge>
				) : null} */}
			</span>
			<Collapse isOpen={isOpen}>
				<ul id="item" className={"sidebar-dropdown list-unstyled"}>
					{children}
				</ul>
			</Collapse>
		</li>
	);
};

const SidebarItem = ({ name, icon: Icon, to }) => {
	const location = useLocation();

	const getSidebarItemClass = path => {
		return location.pathname === path ? "active" : "";
	};

	return (
		<li className={"sidebar-item " + getSidebarItemClass(to)}>
			<NavLink to={to} className="sidebar-link" activeClassName="active">
				{Icon ? <Icon size={18} className="align-middle mr-3" /> : null}
				{name}
				{/* {badgeColor && badgeText ? (
				<Badge color={badgeColor} size={18} className="sidebar-badge">
					{badgeText}
				</Badge>
				) : null} */}
			</NavLink>
		</li>
	);
};

function Sidebar(props: {sidebar: any, layout: any}) {
	const location = useLocation();
	const pathName = location.pathname;

	const {sidebar, layout} = props;

	const initialState = sideBarRoutes.map(route => {
		const isActive = pathName.indexOf(route.path) === 0;
		const isOpen = false; // route.open;
		const isHome = false; // route.containsHome && pathName === "/" ? true : false;

		return isActive || isOpen || isHome;
	});

	const [activeTabs, setActiveTabs] = React.useState(initialState);

	const toggle = (index: number) => {
		console.log(index)
		console.log(activeTabs)
		const newTabs = [...activeTabs];
		newTabs[index] = !newTabs[index];
		setActiveTabs(newTabs);
	};

	const PerfectScrollbar: any = PerfectScrollbarAll

	return (
		<nav
			className={
				"sidebar" +
				(!sidebar.isOpen ? " toggled" : "") +
				(sidebar.isSticky ? " sidebar-sticky" : "")
			}
		>
			<div className="sidebar-content">
				<PerfectScrollbar>
					<a className="sidebar-brand" href="/">
						<Box className="align-middle text-primary mr-2" size={24} />{" "}
						<span className="align-middle">CBI Database</span>
					</a>

					<ul className="sidebar-nav">
						{sideBarRoutes.map((category, index) => {
							return (
								<React.Fragment key={index}>
									{/* {category.header ? (
					<li className="sidebar-header">{category.header}</li>
				) : null} */}

									{category.children ? (
										<SidebarCategory
											name={category.name}
											icon={category.icon}
											to={category.path}
											isOpen={activeTabs[index]}
											onClick={() => toggle(index)}
										>
											{category.children.map((route, index) => (
												<SidebarItem
													key={index}
													name={route.sidebarTitle}
													to={route.getPathFromArgs({})}
													icon={null}
													// isOpen={null}
													// onClick={null}
												/>
											))}
										</SidebarCategory>
									) : (
											<SidebarItem
												name={category.name}
												to={category.path}
												icon={category.icon}
												// isOpen={null}
												// onClick={null}
											/>
										)}
								</React.Fragment>
							);
						})}
					</ul>
				</PerfectScrollbar>
			</div>
		</nav>
	);
}

export default connect((store: any) => ({
	sidebar: store.sidebar,
	layout: store.layout
}))(Sidebar) as any;
