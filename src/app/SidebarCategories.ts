import {
	Compass,
	Sliders as SlidersIcon,
	HelpCircle
} from "react-feather";
// import { routeUsersEditPage, routeUsersNewPage, routeUsersPage } from "./routes/users";
import RouteWrapper from "../core/RouteWrapper";
import { routeJpClassesPage } from "@routes/jp-classes";
import { routeStaggeredOrder } from "@routes/staggered-order";
import { routeManageClassInstructorsPage } from "@routes/admin/class-instructors";
import { routeManageTagsPage } from "@routes/admin/tags";
import { routeManageClassLocationsPage } from "@routes/admin/class-locations";
import { routeManageHighSchools } from "@routes/admin/high-schools";
import { routeManageDonationFundsPage } from "@routes/admin/donation-funds";
import { routeDockReportPage } from "@routes/dh/dock-report";

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
