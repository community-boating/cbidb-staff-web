import PathWrapper from "@core/PathWrapper";

export const pathAdminBase = new PathWrapper('admin');
export const pathManageClassInstructors = pathAdminBase.appendPathSegment("class-instructors");
export const pathManageClassLocations = pathAdminBase.appendPathSegment("class-locations");
export const pathManageDonationFunds = pathAdminBase.appendPathSegment("donation-funds");
export const pathManageHighSchools = pathAdminBase.appendPathSegment("high-schools");
export const pathManageTags = pathAdminBase.appendPathSegment("tags");

export const pathUsers = pathAdminBase.appendPathSegment("users");
export const pathUsersEdit = pathUsers.appendPathSegment<{userId: string}>(":userId")
export const pathUsersNew = pathUsers.appendPathSegment("new")

export const pathPersonSearch = new PathWrapper("person");
export const pathPersonSummary = pathPersonSearch.appendPathSegment<{personId: string}>(":personId")

export const pathJpClasses = new PathWrapper("jp-classes");

export const pathDockhouseBase = new PathWrapper("dh")
export const pathDockReport = pathDockhouseBase.appendPathSegment("dock-report")

export const pathStaggeredOrder = new PathWrapper("staggered-order/:personId");
