import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";

import { Collapse } from "react-bootstrap";
import * as PerfectScrollbarAll from "react-perfect-scrollbar";

import { Box } from "react-feather";

import { sideBarRoutes } from "../app/SidebarCategories";
import { linkWithAccessControl } from "@core/LinkInterceptor";
import RouteWrapper from "@core/RouteWrapper";
import useSidebar from "@hooks/useSidebar";

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
			<Collapse in={isOpen}>
				<ul id="item" className={"sidebar-dropdown list-unstyled"}>
					{children}
				</ul>
			</Collapse>
		</li>
	);
};

const SidebarItem: (props: {
	name: string,
	icon: React.ComponentType<{size: number, className: string}>,
	to?: RouteWrapper<any>,
	pathString?: string,
}) => JSX.Element = 
({ name, icon: Icon, to, pathString }) => {
	const location = useLocation();

	const getSidebarItemClass = path => {
		return location.pathname === path ? "active" : "";
	};

	return (
		<li className={"sidebar-item " + getSidebarItemClass(to)}>
			<NavLink to={pathString || to.getPathFromArgs({})} className="sidebar-link" activeClassName="active" onClick={e => {
				e.preventDefault();
				linkWithAccessControl(null, to, {}, (to && to.requireSudo), pathString)
			}}>
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

function Sidebar() {
	const { isOpen } = useSidebar();
	const location = useLocation();
	const pathName = location.pathname;

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
				(!isOpen ? " toggled" : "")
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
													to={route}
													icon={null}
													// isOpen={null}
													// onClick={null}
												/>
											))}
										</SidebarCategory>
									) : (
											<SidebarItem
												name={category.name}
												pathString={category.path}
												icon={category.icon as any}
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

export default Sidebar;
