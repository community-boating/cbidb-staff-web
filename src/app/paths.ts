import PathWrapper from "@core/PathWrapper";

export const adminBasePath = new PathWrapper('admin');
export const manageClassInstructorsPath = adminBasePath.appendPathSegment("class-instructors");
export const manageClassLocationsPath = adminBasePath.appendPathSegment("class-locations");
export const manageDonationFundsPath = adminBasePath.appendPathSegment("donation-funds");
export const manageHighSchools = adminBasePath.appendPathSegment("high-schools");
export const manageTagsPath = adminBasePath.appendPathSegment("tags");

export const usersPath = new PathWrapper("users");
export const usersEditPath = usersPath.appendPathSegment<{userId: string}>(":userId")
export const usersNewPath = usersPath.appendPathSegment("new")


export const personBasePath = new PathWrapper("person");
export const personSummaryPath = personBasePath.appendPathSegment<{personId: string}>(":personId")

export const jpClassesPath = new PathWrapper("jp-classes");

export const pathStaggeredOrder = new PathWrapper("staggered-order/:personId");
