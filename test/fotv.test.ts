const a = require('./testconfig')

import { getWrapper as getFOTV, createUserWrapper, getUsersWrapper, getPermissionsWrapper, putRestriction, RestrictionType, RestrictionGroupType, putLogoImage, uploadLogoImage } from 'async/staff/dockhouse/fotv-controller'
import { apiw as authenticateStaff } from 'async/authenticate-staff'
import { apiw as isLoggedIn } from 'async/is-logged-in-as-staff'
import * as fs from "fs";

import { expect } from '@jest/globals'

import { ApiResult } from 'core/APIWrapperTypes'
import { asyncGetterValue, addChainedGetter, performGetUntilDone } from './GetterAsyncChained'
import { option } from 'fp-ts'
import { PERMISSIONS } from 'models/permissions'
import axios from 'axios';

const IS_LOGGED_IN = "IS_LOGGED_IN",
AUTHENTICATE_STAFF = "AUTHENTICATE_STAFF_T",
FOTV = "FOTV",
PERMISSIONS_S = "PERMISSIONS",
LOGOUT = "LOGOUT",
IS_LOGGED_IN_NO_SESSION = "IS_LOGGED_IN_NO_SESSION",
GET_USERS = "GET_USERS",
GET_ALL_PERMISSIONS = "GET_ALL_PERMISSIONS",
CREATE_RESTRICTION = "CREATE_RESTRICTION",
UPDATE_RESTRICTION = "UPDATE_RESTRICTION",
TOGGLE_RESTRICTION = "TOGGLE_RESTRICTION",
DELETE_RESTRICTION = "DELETE_RESTRICTION",
CREATE_RESTRICTION_GROUP = "CREATE_RESTRICTION_GROUP",
UPDATE_RESTRICTION_GROUP = "UPDATE_RESTRICTION_GROUP",
DELETE_RESTRICTION_GROUP = "DELETE_RESTRICTION_GROUP",
CREATE_USER = "CREATE_USER",
UPDATE_USER = "UPDATE_USER",
DELETE_USER = "DELETE_USER",
CREATE_LOGO_IMAGE = "CREATE_LOGO_IMAGE",
UPDATE_LOGO_IMAGE = "UPDATE_LOGO_IMAGE",
DELETE_LOGO_IMAGE = "DELETE_LOGO_IMAGE",
UPLOAD_IMAGE = "CREATE_IMAGE"

const dummyUserData = {
    username: "tester",
    password: "testpassword"
}

const dummyASC = {
    state: {
        appProps: null,
        login: {
            authenticatedUserName: option.some(dummyUserData.username),
            permissions: Object.values(PERMISSIONS).reduce((a, b) => {
                a[b] = true
                return a
            }, {})
        },
        borderless: false,
        sudo: (process.env.config as any).instantSudo,
        sudoModalOpener: () => {},
        hasInit: false
    },
    stateAction: undefined
}

const dummyCreateUserData = {
    username: "testy",
    password: "mctestface"
}

const dummyRestrictionData = [
    {
        title: "NEW",
        message: "NEW MESSAGE",
        imageID: option.none,
        active: false,
        groupID: 0,
        textColor: "#0000ff",
        backgroundColor: "#ff0000",
        fontWeight: "normal",
        displayOrder: 0,
        isPriority: false
    }
]

const dummyRestrictionGroupData = [
    {
        title: "NEW GROUP",
        displayOrder: 5,
    }
]

const dummyLogoImageData = [
    {
        title: "NEW IMAGE",
        displayOrder: 5,
        imageType: 5
    }
]

function deps(permissions: string | string[]): {[key: string]: true} {
    var perms = permissions instanceof Array ? permissions : [permissions]
    return perms.reduce((a, b) => {
        a[b] = true
        return a
    }, {})
}

async function testUserPermissionsGetters(dependencyKeys: {[key: string]: true}, keyExtension: string){
    const filesBuffer = await fs.readFileSync("public/images/delete.png")
    const formData = new FormData()
    formData.append('image', new Blob([filesBuffer]))
    console.log(formData)
    console.log(axios.defaults.transformRequest)
    addChainedGetter({
        key: GET_USERS + keyExtension,
        getter: () => getUsersWrapper.send(dummyASC),
        dependencyKeys: dependencyKeys
    })
    addChainedGetter({
        key: CREATE_LOGO_IMAGE + keyExtension,
        getter: () => putLogoImage.sendJson(dummyASC, dummyLogoImageData),
        dependencyKeys: dependencyKeys
    })
    addChainedGetter({
        key: UPLOAD_IMAGE + keyExtension,
        getter: async () => {
            return uploadLogoImage((await asyncGetterValue(CREATE_LOGO_IMAGE + keyExtension))['success'][0]['logoImageID'], "png").sendRaw(option.none, formData, {
                headers: {
                    ['Content-Type']: 'multipart/form-data'
                }
            })
        },
        dependencyKeys: deps(CREATE_LOGO_IMAGE + keyExtension)
    })
    /*addChainedGetter({
        key: GET_ALL_PERMISSIONS + keyExtension,
        getter: () => getPermissionsWrapper.send(dummyASC),
        dependencyKeys: dependencyKeys
    })
    addChainedGetter({
        key: CREATE_RESTRICTION + keyExtension,
        getter: () => putRestriction.sendJson(null, dummyRestrictionData),
        dependencyKeys: dependencyKeys
    })
    addChainedGetter({
        key: CREATE_USER + keyExtension,
        getter: () => createUserWrapper.sendJson(null, dummyCreateUserData),
        dependencyKeys: dependencyKeys
    })*/
}

addChainedGetter({
    key: FOTV,
    getter: () => getFOTV.send(dummyASC),
    dependencyKeys: {}
})
addChainedGetter({
    key: AUTHENTICATE_STAFF,
    getter: () => authenticateStaff().sendJson(null, dummyUserData),
    dependencyKeys: {}
})
addChainedGetter({
    key: IS_LOGGED_IN,
    getter: () => isLoggedIn.send(dummyASC),
    dependencyKeys: deps(AUTHENTICATE_STAFF)
})
/*addChainedGetter({
    key: LOGOUT
    getter: () => logout.send(dummyASC),
    dependencyKeys: { IS_LOGGED_IN: true }
})
addChainedGetter({
    key: IS_LOGGED_IN_NO_SESSION,
    getter: () => isLoggedIn.send(dummyASC),
    dependencyKeys: { LOGOUT: true }
})*/
/*addChainedGetter({
    key: PERMISSIONS,
    getter: () => getUserPermissions().send(dummyASC),
    dependencyKeys: { AUTHENTICATE_STAFF: true}
})*/

testUserPermissionsGetters(deps(AUTHENTICATE_STAFF), "")

performGetUntilDone()

function testUserPermissions(keyExtension: string, testNameExtension: string){
    test('Testing Get User' + testNameExtension, async () => {
        const b = await asyncGetterValue<ApiResult<any>>(GET_USERS + keyExtension)
        expect(b.type).toBe("Success")
        if(b.type == 'Success')
            expect(b.success).toBeInstanceOf(Array)
        else{
            console.log("sdfjklsdjfklljdsfksfdlkj")
        }
    });
}

testUserPermissions("", "")

test('Authenticate Staff Login', async () => {
    const b = await asyncGetterValue<ApiResult<any>>(AUTHENTICATE_STAFF)
    expect(b.type).toBe("Success")
    if(b.type == 'Success')
        expect(b.success).toBe(true)
});

test('Testing Session', async () => {
    const c = await asyncGetterValue<ApiResult<any>>(IS_LOGGED_IN)
    expect(c.type).toBe("Success")
    if(c.type == "Success")
        expect(c.success.value).toBe(dummyUserData.username)
});

test('Testing FOTV Table Dumper', async () => {
    const c = await asyncGetterValue<ApiResult<any>>(FOTV)
    expect(c.type).toBe("Success")
});




/*test('Testing Doing User', async () => {
    const b = await getWrapper.send(dummyASC)
    expect(b.type).toBe("Success")
});*/