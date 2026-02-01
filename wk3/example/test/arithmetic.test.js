/*
install mocha using : npm i mocha

put the file containting test cases in the test folder
use extension filename.test.js

to execute - Option 1
command to run mocha test from file : npx mocha filepath
npx mocha ./test/arithmetic.test.js

to execute - Option 2

update package.json for test script with mocha

  "scripts": {
    "test": "mocha --reporter spec"
  },

then, run the test using : npm test
*/

const assert = require('assert')
const ArithmeticOps = require('../Arithmetic')
const { describe } = require('mocha')

describe("Validating ArithmeticOps class", () => {
    //mention all the test cases to run 

    it("square of (3) should return 9", () => {
        assert.equal(ArithmeticOps.square(3), 9)
    })

    it("square of (12) should return 144", () => {
        assert.equal(ArithmeticOps.square(12), 144)
    })

    it("square of (4) should NOT return 8", () => {
        assert.notEqual(ArithmeticOps.square(4), 8)
    })

    it("percentage(20, 100) should return 20", () => {
        assert.equal(ArithmeticOps.percentage(20, 100), 20)
    })

    it("percentage(20, 50) should NOT return 15", () => {
        assert.notEqual(ArithmeticOps.percentage(20, 50), 15)
    })

    // this test will fail
    it("percentage(10, 50) should return 15", () => {
        assert.equal(ArithmeticOps.percentage(10, 50), 15)
    })
})