import APIWrapper from 'core/APIWrapper'
import { HttpMethod } from 'core/HttpMethod'
import {responseSuccessValidator as scanCardValidator, path as scanCardPath}  from 'models/api-generated/staff/dockhouse/scan-card/get'
import {responseSuccessValidator as signoutResponseValidator, requestValidator as createSignoutValidator, path as createSignoutPath}  from 'models/api-generated/staff/dockhouse/create-signout/post'

export function getScanCard(cardNum: string){
    return new APIWrapper({
        path: scanCardPath + "?cardNumber=" + encodeURIComponent(cardNum),
	    type: HttpMethod.GET,
	    resultValidator: scanCardValidator,
        permissions: []
    })
}

export const postCreateSignout = new APIWrapper({
    path: createSignoutPath,
    type: HttpMethod.POST,
    postBodyValidator: createSignoutValidator,
    resultValidator: signoutResponseValidator,
    permissions: []
})

import { responseSuccessValidator as apClassTypesValidator, path as apClassTypesPath } from './api-generated/staff/rest/ap-class-types/get'
import { responseSuccessValidator as apClassSessionValidator, path as apClassSessionsTodayPath } from './api-generated/staff/rest/ap-class-sessions/today/get'
import { responseSuccessValidator as apClassInstanceValidator, path as apClassInstancesThisSeasonPath } from './api-generated/staff/rest/ap-class-instances/this-season/get'

export const getApClassTypes = new APIWrapper({
    path: apClassTypesPath,
    type: HttpMethod.GET,
    resultValidator: apClassTypesValidator,
    permissions: []
})

export const getApClassSessionsToday = new APIWrapper({
    path: apClassSessionsTodayPath,
    type: HttpMethod.GET,
    resultValidator: apClassSessionValidator,
    permissions: []
})

export const getApClassInstancesThisSeason = new APIWrapper({
    path: apClassInstancesThisSeasonPath,
    type: HttpMethod.GET,
    resultValidator: apClassInstanceValidator,
    permissions: []
})