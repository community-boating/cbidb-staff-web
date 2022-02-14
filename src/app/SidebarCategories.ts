import {
	Compass,
	Sliders as SlidersIcon,
	Users as UsersIcon,
	HelpCircle
} from "react-feather";
import RouteWrapper from "../core/RouteWrapper";
import { routePersonSearch } from "@routes/person/search";
import { routeJpClassesPage } from "@routes/jp-classes";
import { routeUsersEditPage, routeUsersNewPage, routeUsersPage } from "@routes/users";
import { routeManageClassInstructorsPage } from "@routes/admin/class-instructors";
import { routeManageTagsPage } from "@routes/admin/tags";
import { routeManageClassLocationsPage } from "@routes/admin/class-locations";
import { routeManageHighSchools } from "@routes/admin/high-schools";
import { routeManageDonationFundsPage } from "@routes/admin/donation-funds";
import { routeStaggeredOrder } from "@routes/staggered-order";
import { routePersonSummary } from "@routes/person/summary";

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
		routeManageClassInstructorsPage,
		routeManageTagsPage,
		routeManageClassLocationsPage,
		routeManageHighSchools,
		routeManageDonationFundsPage,
	],
	unrenderedChildren: [
		routeUsersNewPage,
		routeUsersEditPage,
	]
};

const misc: SideBarCategory = {
	path: "",
	name: "Misc",
	icon: HelpCircle,
	children: [
	],
	unrenderedChildren: [
		routeStaggeredOrder
	]
};

// Dashboard specific routes
export const sideBarRoutes = [
	jp,
	person_summary,
	admin,
	misc,
];
