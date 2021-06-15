import assertNever from "@util/assertNever";

export enum UserType {
	User = "U",
	Manager = "M",
	Admin = "A"
}

export function userTypeDisplay(u: string) {
	switch (u) {
	case UserType.User:
		return "User";
	case UserType.Manager:
		return "Manager";
	case UserType.Admin:
		return "Admin";
	default:
		return u;
	}
}

export const userTypes = [
	UserType.User,
	UserType.Manager,
	UserType.Admin,
]