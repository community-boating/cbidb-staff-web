'use strict'

import assert = require('assert')

import { createUserWrapper } from '../src/async/staff/dockhouse/fotv-controller'
//import {assert} from 'assert'
//const assert = require('assert')

describe("FOTV API Tests", function() {
    it("Create User Test", () => {
        return createUserWrapper.sendJson(null, {username: "", password: ""}).then((a) => {
            assert.equal(a.type, "Success")
        })
    })
})

module.exports = {
    butt: "yolo"
}

module.exports