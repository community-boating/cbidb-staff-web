import {
	Compass,
	Sliders as SlidersIcon,
	Users as UsersIcon,
	// HelpCircle
} from "react-feather";
import { usersEditPageRoute, usersNewPageRoute, usersPageRoute } from "./routes/users";
import RouteWrapper from "../core/RouteWrapper";
import { jpClassesPageRoute } from "@routes/jp-classes";
// import { staggeredOrderRoute } from "@routes/staggered-order";
import { manageClassInstructorsPageRoute } from "@routes/admin/class-instructors";
import { manageTagsPageRoute } from "@routes/admin/tags";
import { manageDonationFundsPageRoute } from "@routes/admin/donation-funds";
import { searchPageRoute } from "@routes/summary/_base";
import { summaryPageRoute } from "@routes/summary/person-summary";

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
		jpClassesPageRoute
	]
}

const person_summary: SideBarCategory = {
	path: "/person",
	name: "Members",
	icon: UsersIcon,
	children: [
		searchPageRoute
	],
	unrenderedChildren: [
		summaryPageRoute
	]
};

const admin: SideBarCategory = {
	path: "/tables",
	name: "Admin",
	icon: SlidersIcon,
	children: [
		usersPageRoute,
		manageClassInstructorsPageRoute,
		manageTagsPageRoute,
		manageDonationFundsPageRoute,
	],
	unrenderedChildren: [
		usersNewPageRoute,
		usersEditPageRoute,
	]
};

// const misc: SideBarCategory = {
// 	path: "",
// 	name: "Misc",
// 	icon: HelpCircle,
// 	children: [
// 	],
// 	unrenderedChildren: [
// 		staggeredOrderRoute
// 	]
// };

// Dashboard specific routes
export const sideBarRoutes = [
	jp,
	person_summary,
	admin,
	// misc,
];
