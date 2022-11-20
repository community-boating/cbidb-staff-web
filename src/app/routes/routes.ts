import {
	Compass,
	Sliders as SlidersIcon,
	HelpCircle,
	TrendingUp,
} from "react-feather";
// import { routeUsersEditPage, routeUsersNewPage, routeUsersPage } from "./routes/users";
import RouteWrapper from "../../core/RouteWrapper";
import { routeJpClassesPage } from "app/routes/jp-classes";
import { routeStaggeredOrder } from "app/routes/staggered-order";
import { routeDockReportPage } from "app/routes/dh/dock-report";
import { routeSignoutsTablesPage } from "./dh/signouts-tables";
import { routeDockhousePage } from "app/routes/dh/dockhouse-page";

// Dashboard specific routes
export const dhRoutes: RouteWrapper<any>[] = [
	routeJpClassesPage,
	routeStaggeredOrder,
	routeDockReportPage,
	routeSignoutsTablesPage,
	routeDockhousePage,
];
