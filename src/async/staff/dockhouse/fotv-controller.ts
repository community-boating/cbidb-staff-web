import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalNumber, OptionalString, allowNullUndefinedProps, makeOptionalPK, makeOptionalProps } from 'util/OptionalTypeValidators';

export const logoImageValidator = t.type({
    logoImageID: t.number,
    imageID: t.number,
    imageVersion: t.number,
    title: t.string,
    displayOrder: t.number,
    imageType: t.number,
})

export const restrictionConditionValidator = t.type({
    conditionID: t.number,
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

export const restrictionToRestrictionCondition = t.type({
    id: t.number,
    restrictionID: t.number,
    conditionID: t.number
})

export const validator = t.type({
    sunset: t.string,
    restrictions: t.array(restrictionValidator),
    restrictionGroups: t.array(restrictionGroupValidator),
    logoImages: t.array(logoImageValidator),
    activeProgramID: t.number
})

const path: string = "/fotv"

const pathPutRestriction: string = '/restriction';

const pathPutRestrictionGroup: string = '/restrictionGroup';

const pathPutLogoImage: string = '/logoImage'

const pathPutRestrictionCondition: string = '/restrictionCondition';

const pathUploadLogoImage: string = '/uploadImage'

export type FOTVType = t.TypeOf<typeof validator>;

export type RestrictionType = t.TypeOf<typeof restrictionValidator>;

export type RestrictionGroupType = t.TypeOf<typeof restrictionGroupValidator>;

export type LogoImageType = t.TypeOf<typeof logoImageValidator>;

export type RestrictionConditionType = t.TypeOf<typeof restrictionConditionValidator>;

export const getWrapper = new APIWrapper({
    path: path,
    type: HttpMethod.GET,
    resultValidator: validator,
    serverIndex: 1
})

export const putRestrictionGroup = new APIWrapper({
    path: pathPutRestrictionGroup,
    type: HttpMethod.POST,
    resultValidator: t.array(restrictionGroupValidator),
    postBodyValidator: t.array(allowNullUndefinedProps(restrictionGroupValidator)),
    serverIndex: 1
})

export const putRestriction = new APIWrapper({
    path: pathPutRestriction,
    type: HttpMethod.POST,
    resultValidator: t.array(restrictionValidator),
    postBodyValidator: t.array(allowNullUndefinedProps(restrictionValidator)),
    serverIndex: 1
})

export const putRestrictionCondition = new APIWrapper({
    path: pathPutRestrictionCondition,
    type: HttpMethod.POST,
    resultValidator: t.array(restrictionConditionValidator),
    postBodyValidator: t.array(allowNullUndefinedProps(restrictionConditionValidator)),
    serverIndex: 1
})

export const deleteRestrictionCondition = new APIWrapper({
    path: pathPutRestrictionCondition,
    type: HttpMethod.DELETE,
    resultValidator: t.any,
    postBodyValidator: t.array(t.type({conditionID: t.number})),
    serverIndex: 1
})

export const deleteRestrictionGroup = new APIWrapper({
    path: pathPutRestrictionGroup,
    type: HttpMethod.DELETE,
    resultValidator: t.any,
    postBodyValidator: t.type({groupID: t.number}),
    serverIndex: 1
})

export const deleteRestriction = new APIWrapper({
    path: pathPutRestriction,
    type: HttpMethod.DELETE,
    resultValidator: t.any,
    postBodyValidator: t.type({restrictionID: t.number}),
    serverIndex: 1
})

export const putLogoImage = new APIWrapper({
    path: pathPutLogoImage,
    type: HttpMethod.POST,
    resultValidator: t.array(logoImageValidator),
    postBodyValidator: t.array(allowNullUndefinedProps(logoImageValidator)),
    serverIndex: 1
})

export const deleteLogoImage = new APIWrapper({
    path: pathPutLogoImage,
    type: HttpMethod.DELETE,
    resultValidator: t.any,
    postBodyValidator: t.type({logoImageID: t.number}),
    serverIndex: 1
})

export function uploadLogoImage(imageID: number, suffix: string) {
    return new APIWrapper(
        {
            path: pathUploadLogoImage + '/' + (imageID || 'NaN') + '/' + suffix,
            type: HttpMethod.POST,
            resultValidator: logoImageValidator,
            postBodyValidator: t.any,
            serverIndex: 1
        }
)
}

/*export const deleteRestriction = new APIWrapper({
    path: pathPutRestriction,
    type: HttpMethod.DELETE,
    resultValidator: t.any,
    postBodyValidator: t.type({restrictionID: t.number}),
    serverIndex: 1
})*/