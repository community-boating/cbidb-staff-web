import * as React from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";

import { Badge, Collapse } from "reactstrap";
import * as PerfectScrollbarAll from "react-perfect-scrollbar";

import { Box } from "react-feather";

import { sideBarRoutes } from "../routes/index";

const SidebarCategory = withRouter<{ history: any, location: any, match: any, name: any, icon: any, isOpen: any, onClick: any, to: any }, any>(
	({
		name,
		icon: Icon,
		isOpen,
		children,
		onClick,
		location,
		to
	}) => {
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
	}
);

const SidebarItem = withRouter<{ history: any, location: any, match: any, name: string, icon: React.ReactNode, isOpen: boolean, onClick: any, to: string }, any>(
	({ name, icon: Icon, location, to }) => {
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
	}
);

class Sidebar extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	toggle = index => {
		this.setState(state => ({
			[index]: !state[index]
		}));
	};

	componentWillMount() {
		/* Open collapse element that matches current url */
		const pathName = this.props.location.pathname;

		sideBarRoutes.forEach((route, index) => {
			const isActive = pathName.indexOf(route.path) === 0;
			const isOpen = false; // route.open;
			const isHome = false; // route.containsHome && pathName === "/" ? true : false;

			this.setState(() => ({
				[index]: isActive || isOpen || isHome
			}));
		});
	}

	render() {
		const { sidebar, layout } = this.props;

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
												isOpen={this.state[index]}
												onClick={() => this.toggle(index)}
											>
												{category.children.map((route, index) => (
													<SidebarItem
														key={index}
														name={route.sidebarTitle}
														to={route.getPathFromArgs({})}
														icon={null}
														isOpen={null}
														onClick={null}
													/>
												))}
											</SidebarCategory>
										) : (
												<SidebarItem
													name={category.name}
													to={category.path}
													icon={category.icon}
													isOpen={null}
													onClick={null}
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
}

export default withRouter(
	connect((store: any) => ({
		sidebar: store.sidebar,
		layout: store.layout
	}))(Sidebar) as any
);
