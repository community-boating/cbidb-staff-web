// import { routeUsersEditPage, routeUsersNewPage, routeUsersPage } from "./routes/users";
import RouteWrapper from "../../core/RouteWrapper";
import { routeDockReportPage } from "app/routes/dh/dock-report";
import { routeSignoutsTablesPage } from "./dh/signouts-tables";
import { routeDockhousePage } from "app/routes/dh/dockhouse-page";
import { routeIncidentsPage } from "./dh/incidents";
import { routeClassesPage } from "./dh/classes";
import { routeFOTVControllerPage } from "./dh/fotv-controller";

// Dashboard specific routes
export const dhRoutes: RouteWrapper<any>[] = [
	routeDockhousePage,
	routeSignoutsTablesPage,
	routeClassesPage,
	routeIncidentsPage,
	routeDockReportPage,
	routeFOTVControllerPage
];
