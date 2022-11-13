import {
	Compass,
	Sliders as SlidersIcon,
	Users as UsersIcon,
	HelpCircle,
	TrendingUp,
} from "react-feather";
import RouteWrapper from "../core/RouteWrapper";
import { routeJpClassesPage } from "app/routes/jp-classes";
import { routeStaggeredOrder } from "app/routes/staggered-order";
import { routeManageClassInstructorsPage } from "app/routes/admin/class-instructors";
import { routeManageTagsPage } from "app/routes/admin/tags";
import { routeManageClassLocationsPage } from "app/routes/admin/class-locations";
import { routeManageHighSchools } from "app/routes/admin/high-schools";
import { routeManageDonationFundsPage } from "app/routes/admin/donation-funds";
import { routeDockReportPage } from "app/routes/dh/dock-report";
import { routeSignoutsTablesPage } from "./routes/dh/signouts-tables";
import { routeUsersPage } from "./routes/admin/users";
import { routeManageAccess } from "./routes/admin/manage-permissions";
import { salesDashboardPageRoute } from "app/routes/reporting/salesDashboard";
import { routePersonSearch } from "app/routes/person/search";
import { routePersonSummary } from "app/routes/person/summary";

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

const reporting: SideBarCategory = {
	path: "/reporting",
	name: "Reporting",
	icon: TrendingUp,
	children: [
		salesDashboardPageRoute,
	]
}

const person_summary: SideBarCategory = {
	path: "/person",
	name: "Members",
	icon: UsersIcon,
	children: [
		routePersonSearch
	],
	unrenderedChildren: [
		routePersonSummary
	]
};

const admin: SideBarCategory = {
	path: "/tables",
	name: "Admin",
	icon: SlidersIcon,
	children: [
		routeUsersPage,
		routeManageAccess,
		routeManageClassInstructorsPage,
		routeManageTagsPage,
		routeManageClassLocationsPage,
		routeManageHighSchools,
		routeManageDonationFundsPage,
	],
	unrenderedChildren: [
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
		routeDockReportPage,
		routeSignoutsTablesPage,
	]
};

// Dashboard specific routes
export const sideBarRoutes = [
	// jp,
	reporting,
	person_summary,
	admin,
	misc,
];
