import {
	Compass,
	Sliders as SlidersIcon,
	HelpCircle
} from "react-feather";
import { usersEditPageRoute, usersNewPageRoute, usersPageRoute } from "./routes/users";
import RouteWrapper from "../core/RouteWrapper";
import { jpClassesPageRoute } from "@routes/jp-classes";
import { staggeredOrderRoute } from "@routes/staggered-order";
import { manageClassInstructorsPageRoute } from "@routes/admin/class-instructors";
import { manageTagsPageRoute } from "@routes/admin/tags";
import { manageClassLocationsPageRoute } from "@routes/admin/class-locations";
import { manageHighSchoolsRoute } from "@routes/admin/high-schools";
import { manageDonationFundsPageRoute } from "@routes/admin/donation-funds";

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

const admin: SideBarCategory = {
	path: "/tables",
	name: "Admin",
	icon: SlidersIcon,
	children: [
		usersPageRoute,
		manageClassInstructorsPageRoute,
		manageTagsPageRoute,
		manageClassLocationsPageRoute,
		manageHighSchoolsRoute,
		manageDonationFundsPageRoute,
	],
	unrenderedChildren: [
		usersNewPageRoute,
		usersEditPageRoute,
	]
};

const misc: SideBarCategory = {
	path: "",
	name: "Misc",
	icon: HelpCircle,
	children: [
	],
	unrenderedChildren: [
		staggeredOrderRoute
	]
};

// Dashboard specific routes
export const sideBarRoutes = [
	jp,
	admin,
	misc,
];
