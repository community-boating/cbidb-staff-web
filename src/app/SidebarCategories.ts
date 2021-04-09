import {
	Compass,
	Sliders as SlidersIcon,
} from "react-feather";
import { usersEditPageRoute, usersPageRoute } from "./routes/users";
import RouteWrapper from "../core/RouteWrapper";
import { jpClassesPageRoute } from "@routes/jp-classes";

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
		usersPageRoute
	],
	unrenderedChildren: [
		usersEditPageRoute
	]
};

// Dashboard specific routes
export const sideBarRoutes = [
	jp,
	admin,
];
