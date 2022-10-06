import asc from "app/AppStateContainer";
import { PERMISSIONS } from "models/permissions";
import assertNever from "util/assertNever";
import { PageName } from "./pageNames";

export function canAccessPage(pageName: PageName): boolean {
	switch (pageName) {
		case PageName.HOME:
		case PageName.JP_CLASSES:
		case PageName.STAGGERED_ORDER:
		case PageName.DOCK_REPORT:
		case PageName.SALES_DASHBOARD:
			return true;
		case PageName.USERS:
		case PageName.USERS_EDIT:
		case PageName.USERS_NEW:
			return !!asc.state.login.permissions[PERMISSIONS.PERM_MANAGE_USERS_SCREEN]
		case PageName.MANAGE_INSTRUCTORS:
			return !!asc.state.login.permissions[PERMISSIONS.PERM_UPDATE_JP_INSTRUCTORS]
		case PageName.MANAGE_TAGS:
			return !!asc.state.login.permissions[PERMISSIONS.PERM_UPDATE_TAGS]
		case PageName.MANAGE_CLASS_LOCATIONS:
			return !!asc.state.login.permissions[PERMISSIONS.PERM_UPDATE_JP_CLASS_LOCATIONS]
		case PageName.MANAGE_HIGH_SCHOOLS:
			return !!asc.state.login.permissions[PERMISSIONS.PERM_UPDATE_SCHOOLS]
		case PageName.MANAGE_DONATION_FUNDS:
			return !!asc.state.login.permissions[PERMISSIONS.PERM_UPDATE_DONATION_FUNDS]
		case PageName.MANAGE_ACCESS:
		case PageName.MANAGE_PERMISSIONS:
			return !!asc.state.login.permissions[PERMISSIONS.PERM_MANAGE_ACCESS]
		case PageName.SIGNOUTS_TABLES:
			return true; 
		default:
			assertNever(pageName);
			return false;
	}
}
