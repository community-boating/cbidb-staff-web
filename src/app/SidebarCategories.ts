import {
	Compass,
	Sliders as SlidersIcon,
	HelpCircle
} from "react-feather";
// import { routeUsersEditPage, routeUsersNewPage, routeUsersPage } from "./routes/users";
import RouteWrapper from "../core/RouteWrapper";
import { routeJpClassesPage } from "app/routes/jp-classes";
import { routeStaggeredOrder } from "app/routes/staggered-order";
import { routeManageClassInstructorsPage } from "app/routes/admin/class-instructors";
import { routeManageTagsPage } from "app/routes/admin/tags";
import { routeManageClassLocationsPage } from "app/routes/admin/class-locations";
import { routeManageHighSchools } from "app/routes/admin/high-schools";
import { routeManageDonationFundsPage } from "app/routes/admin/donation-funds";
import { routeDockReportPage } from "app/routes/dh/dock-report";

export type SideBarCategory = {
	path: string,
	name: string,
	icon: React.ComponentType,
	children: RouteWrapper<any>[],
	unrenderedChildren?: RouteWrapper<any>[],
}

const jp: SideBarCategory = {
	path: "/jp-classes",
	name: "Junior Program",
	icon: Compass,
	children: [
		routeJpClassesPage
	]
}

const admin: SideBarCategory = {
	path: "/tables",
	name: "Admin",
	icon: SlidersIcon,
	children: [
		// routeUsersPage,
		routeManageClassInstructorsPage,
		routeManageTagsPage,
		routeManageClassLocationsPage,
		routeManageHighSchools,
		routeManageDonationFundsPage,
	],
	unrenderedChildren: [
		// routeUsersNewPage,
		// routeUsersEditPage,
	]
};

const misc: SideBarCategory = {
	path: "",
	name: "Misc",
	icon: HelpCircle,
	children: [
	],
	unrenderedChildren: [
		routeStaggeredOrder,
		routeDockReportPage
	]
};

// Dashboard specific routes
export const sideBarRoutes = [
	// jp,
	admin,
	misc,
];
