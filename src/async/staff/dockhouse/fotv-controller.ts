import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalNumber, OptionalString, allowNullUndefinedProps, makeOptionalPK, makeOptionalProps } from 'util/OptionalTypeValidators';
import { PERMISSIONS } from 'models/permissions';

export const imageValidator = t.type({
    imageID: t.number,
    imageSuffix: t.string,
    version: t.number,
})

export const logoImageValidator = t.type({
    logoImageID: t.number,
    imageID: t.number,
    title: t.string,
    displayOrder: t.number,
    imageType: t.number,
})

export const restrictionConditionValidator = t.type({
    conditionID: t.number,
    restrictionID: t.number,
    conditionAction: OptionalNumber,
    conditionType: OptionalNumber,
    conditionInfo: OptionalString
})

export const restrictionActionValidator = t.type({
    actionID: t.number,
    actionName: t.string,
    actionInternalType: t.number
})

export const restrictionValidator = t.type({
    restrictionID: t.number,
    title: t.string,
    message: t.string,
    imageID: OptionalNumber,
    active: t.boolean,
    groupID: t.number,
    textColor: t.string,
    backgroundColor: t.string,
    fontWeight: t.string,
    displayOrder: t.number,
    isPriority: t.boolean
})

export const restrictionGroupValidator = t.type({
    groupID: t.number,
    title: t.string,
    displayOrder: t.number
})

export const restrictionToRestrictionAction = t.type({
    id: t.number,
    restrictionID: t.number,
    actionID: t.number
})

export const singletonDataValidator = t.type({
    data_key: t.string,
    value: t.string
})

export const validator = t.type({
    sunset: t.string,
    restrictions: t.array(restrictionValidator),
    restrictionGroups: t.array(restrictionGroupValidator),
    logoImages: t.array(logoImageValidator),
    restrictionConditions: t.array(restrictionConditionValidator),
    images: t.array(imageValidator),
    singletonData: t.array(singletonDataValidator),
})

export const permissionValidator = t.type({
    permissionID: t.number,
    permissionKey: t.number,
    userID: t.number
})

export const userValidator = t.type({
    userID: t.number,
    username: t.string
})

const pathUsers = '/users';
const pathCreateUser = '/create_user';
const pathUpdateUser = '/update_user';

const pathPermissions = '/permissions';

const pathGrantPermissions = '/grant_permissions';

const pathRevokePermissions = '/revoke_permissions';

const path: string = "/fotv";

const pathToggleRestriction: string = '/toggleRestriction';

const pathPutRestriction: string = '/restriction';

const pathPutRestrictionGroup: string = '/restrictionGroup';

const pathPutLogoImage: string = '/logoImage'

const pathPutSingletonData: string = '/singletonData';

const pathPutRestrictionCondition: string = '/restrictionCondition';

const pathUploadLogoImage: string = '/uploadImage'

export type FOTVType = t.TypeOf<typeof validator>;

export type RestrictionType = t.TypeOf<typeof restrictionValidator>;

export type RestrictionGroupType = t.TypeOf<typeof restrictionGroupValidator>;

export type LogoImageType = t.TypeOf<typeof logoImageValidator>;

export type ImageType = t.TypeOf<typeof imageValidator>;

export type RestrictionConditionType = t.TypeOf<typeof restrictionConditionValidator>;

export type SingletonDataType = t.TypeOf<typeof singletonDataValidator>;

export type UserType = t.TypeOf<typeof userValidator>;

export type PermissionType = t.TypeOf<typeof permissionValidator>;

export const getWrapper = new APIWrapper({
    path: path,
    type: HttpMethod.GET,
    resultValidator: validator,
})

export const getUsersWrapper = new APIWrapper({
    path: pathUsers,
    type: HttpMethod.GET,
    resultValidator: t.array(userValidator),
    permissions: [PERMISSIONS.VIEW_USERS]
})

export const getPermissionsWrapper = new APIWrapper({
    path: pathPermissions,
    type: HttpMethod.GET,
    resultValidator: t.array(permissionValidator),
    permissions: [PERMISSIONS.VIEW_PERMISSIONS]
})

export const createUserWrapper = new APIWrapper({
    path: pathCreateUser,
    type: HttpMethod.POST,
    resultValidator: t.union([userValidator, t.type({result: t.string})]),
    postBodyValidator: t.type({username: t.string, password: t.string})
})

export const updateUserWrapper = new APIWrapper({
    path: pathUpdateUser,
    type: HttpMethod.POST,
    resultValidator: t.type({result: t.string}),
    postBodyValidator: t.type({username: OptionalString, userID: t.number, password: OptionalString, changedUsername: t.boolean, changedPassword: t.boolean, forceLogout: t.boolean})
})

export const deleteUserWrapper = new APIWrapper({
    path: pathUsers,
    type: HttpMethod.DELETE,
    resultValidator: t.any,
    postBodyValidator: t.type({userID: t.number})
})

export const permissionChangeType = t.type({
    permissions: t.array(t.number),
    userID: t.number
})

export const grantPermissionWrapper = new APIWrapper({
    path: pathGrantPermissions,
    type: HttpMethod.POST,
    resultValidator: t.array(permissionValidator),
    postBodyValidator: permissionChangeType
})

export const revokePermissionWrapper = new APIWrapper({
    path: pathRevokePermissions,
    type: HttpMethod.POST,
    resultValidator: t.array(permissionValidator),
    postBodyValidator: permissionChangeType
})

export const putRestrictionGroup = new APIWrapper({
    path: pathPutRestrictionGroup,
    type: HttpMethod.POST,
    resultValidator: t.array(restrictionGroupValidator),
    postBodyValidator: t.array(allowNullUndefinedProps(restrictionGroupValidator)),
})

export const putRestriction = new APIWrapper({
    path: pathPutRestriction,
    type: HttpMethod.POST,
    resultValidator: t.array(restrictionValidator),
    postBodyValidator: t.array(allowNullUndefinedProps(restrictionValidator)),
})

export const toggleRestriction = new APIWrapper({
    path: pathToggleRestriction,
    type: HttpMethod.POST,
    resultValidator: restrictionValidator,
    postBodyValidator: t.type({restrictionID: t.number, active: t.boolean}),
})

export const putRestrictionCondition = new APIWrapper({
    path: pathPutRestrictionCondition,
    type: HttpMethod.POST,
    resultValidator: t.array(restrictionConditionValidator),
    postBodyValidator: t.array(allowNullUndefinedProps(restrictionConditionValidator)),
})

export const putSingletonData = new APIWrapper({
    path: pathPutSingletonData,
    type: HttpMethod.POST,
    resultValidator: t.array(singletonDataValidator),
    postBodyValidator: t.array(allowNullUndefinedProps(singletonDataValidator)),
})

export const deleteSingletonData = new APIWrapper({
    path: pathPutSingletonData,
    type: HttpMethod.DELETE,
    resultValidator: t.any,
    postBodyValidator: t.array(t.type({data_key: t.string})),
})

export const deleteRestrictionCondition = new APIWrapper({
    path: pathPutRestrictionCondition,
    type: HttpMethod.DELETE,
    resultValidator: t.any,
    postBodyValidator: t.array(t.type({conditionID: t.number})),
})

export const deleteRestrictionGroup = new APIWrapper({
    path: pathPutRestrictionGroup,
    type: HttpMethod.DELETE,
    resultValidator: t.any,
    postBodyValidator: t.type({groupID: t.number}),
})

export const deleteRestriction = new APIWrapper({
    path: pathPutRestriction,
    type: HttpMethod.DELETE,
    resultValidator: t.any,
    postBodyValidator: t.type({restrictionID: t.number}),
})

export const putLogoImage = new APIWrapper({
    path: pathPutLogoImage,
    type: HttpMethod.POST,
    resultValidator: t.array(logoImageValidator),
    postBodyValidator: t.array(allowNullUndefinedProps(logoImageValidator)),
})

export const deleteLogoImage = new APIWrapper({
    path: pathPutLogoImage,
    type: HttpMethod.DELETE,
    resultValidator: t.any,
    postBodyValidator: t.type({logoImageID: t.number}),
})

export function uploadLogoImage(imageID, suffix: string) {
    return new APIWrapper(
        {
            path: pathUploadLogoImage + '/' + (imageID || 'NaN') + '/' + suffix,
            type: HttpMethod.POST,
            resultValidator: logoImageValidator,
            postBodyValidator: t.any,
        }
    )
}

/*export const deleteRestriction = new APIWrapper({
    path: pathPutRestriction,
    type: HttpMethod.DELETE,
    resultValidator: t.any,
    postBodyValidator: t.type({restrictionID: t.number}),
})*/