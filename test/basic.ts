import * as assert from "assert"

describe("Mocha Smoketest", function() {
	it("should pass a basic smoketest", function() {
		assert.ok(true)
	})
	it("should compare numbers", function() {
		assert.equal(2, 2)
	})
	it("should check references...", function() {
		const a = {}
		const b = {}
		assert.notEqual(a, b)
	})
	it("...unless you deepEqual", function() {
		const a = {}
		const b = {}
		assert.deepEqual(a, b)
	})
	it("can detect a thrown exception", function() {
		function iThrow() {
			const u: any = undefined
			u.foo()
		}
		assert.throws(iThrow)
	})
})