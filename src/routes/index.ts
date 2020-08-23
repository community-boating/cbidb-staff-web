import async from "../components/Async";

import {
	Sliders as SlidersIcon,
} from "react-feather";
import { usersPageRoute } from "../app/routes/users";
import RouteWrapper from "../core/RouteWrapper";

export type SideBarCategory = {
	path: string,
	name: string,
	icon: React.ComponentType,
	children: RouteWrapper<any>[]
}

const adminRoutes: SideBarCategory = {
	path: "/tables",
	name: "Admin",
	icon: SlidersIcon,
	children: [
		usersPageRoute
	]
};

// Dashboard specific routes
export const sideBarRoutes = [
	adminRoutes
];

// Auth specific routes
export const page = [];