import asc from "@app/AppStateContainer";
import assertNever from "@util/assertNever";
import { PageName } from "./pageNames";

export function canAccessPage(pageName: PageName): boolean {
	switch (pageName) {
		case PageName.HOME:
		case PageName.JP_CLASSES:
		case PageName.STAGGERED_ORDER:
			return true;
		case PageName.USERS:
		case PageName.USERS_EDIT:
		case PageName.USERS_NEW:
		case PageName.MANAGE_INSTRUCTORS:
		case PageName.MANAGE_TAGS:
		case PageName.MANAGE_CLASS_LOCATIONS:
			const userType = asc.state.login.permissions.getOrElse(null).userType;
			return userType == "M" || userType == "A";
		default:
			assertNever(pageName);
			return false;
	}
}
