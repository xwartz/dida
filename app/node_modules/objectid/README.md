# objectid
mongodb objectid utilities

## about

1.x is probably the version you want to use in a browser. 3.x focuses on compatibility with the npm `mongodb` driver.

## installation

    $ npm install objectid

## usage

    var objectid = require('objectid')

    var id = objectid()

    objectid.isValid(id)
    // => true

    objectid.isValid('4frsdef43wzx')
    // => false

`objectid.isValid` returns true for `mongodb` native driver `ObjectID` objects, or any other representations with a `.toString` method which returns the hex string encoding of a valid objectid.

Calling `objectid` with an existing objectid - whether a string, an object created by this module, an objectid created by another driver (such as the result of a query) - will cast the value to an instanceof this module. It will throw if the argument is not a valid ObjectId.

## Static Methods

### ObjectId.equals(oidA, oidB) => Boolean
Curried to support creating equality predicates.

### ObjectId.tryParse(oid, out, as) => Boolean

### ObjectId.isValid(oid) => Boolean

## Instance Methods

### ObjectId#equals(oidB) => Boolean

### ObjectId#toString() => String

### ObjectId#toJSON() => String

## running the tests

From package root:

    $ npm install
    $ npm test

## contributors

jden <jason@denizac.org> @leJDen

## license

MIT. (c) 2013 Agile Diagnosis <hello@agilediagnosis.com> See LICENSE.md
