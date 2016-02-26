var chai = require('chai')
chai.should()
var expect = chai.expect
chai.use(require('chai-interface'))

var ObjectId = require('./index')
var NativeObjectId = require('mongodb').ObjectID
var bson = require('bson').BSONPure

var testOid = '511083bb08ce6b1b00000003'

describe('objectid', function () {
  it ('has interface', function () {
    // constructor
    ObjectId.should.be.a('function')

    // static
    ObjectId.should.have.interface({
      equals: Function,
      tryParse: Function,
      isValid: Function
    })

    // instance
    ObjectId().should.be.an('object')

  })

  it('has a bsontype to work with the `bson` module', function () {
    var id = ObjectId()
    id._bsontype.should.equal('ObjectID');
  })

  it('serializes the same as a bson ObjectID', function () {
    var id1 = ObjectId(testOid)
    var id2 = bson.ObjectID(testOid)

    var b1 = bson.BSON.serialize(id1)
    var b2 = bson.BSON.serialize(id2)

    bson.BSON.deserialize(b1).id.should.equal(bson.BSON.deserialize(b2).id)

  })

  describe('#toJSON', function () {
    it('JSON serializes to its id string', function () {
      var id = ObjectId(testOid)
      JSON.stringify(id).should.equal('"' + testOid + '"')
    })
  })

  it('casts native driver ObjectIds', function () {
    var nativeOid = new NativeObjectId()
    var oid = ObjectId(nativeOid)
    oid.should.be.instanceof(ObjectId.constructor)
    oid.toString().should.equal(nativeOid.toString())
  })

  it('generates a new objectId', function () {
    var oid = ObjectId()
    oid.should.not.equal(undefined)
  })


  it('casts itself to itself', function () {
    var oid = ObjectId()
    var oid2 = ObjectId(oid)
    oid2.should.be.instanceof(ObjectId.constructor)
    oid.toString().should.equal(oid2.toString())
  })

  it('returns the same object if casting an ObjectId', function () {
    var oid = ObjectId()
    var oid2 = ObjectId(oid)
    expect(oid === oid2).to.equal(true)
  })

  it('casts strings to ObjectIds', function () {
    var oid = '511083bb08ce6b1b00000003'
    var oid2 = ObjectId(oid)
    oid.should.equal(oid2.toString())
  })

  it('throws if called as a cast of an invalid objectid', function () {
    expect(function () {
      var oid = ObjectId('fsodfisohj')
    }).to.throw(/invalid/i)
  })

  it('throws when casting falsy values', function () {
    expect(function () {
      var id
      ObjectId(id)
    }).to.throw(/invalid/i)
    expect(function () {
      var id = false
      ObjectId(id)
    }).to.throw(/invalid/i)
    expect(function () {
      var id = null
      ObjectId(id)
    }).to.throw(/invalid/i)
    expect(function () {
      var id = ''
      ObjectId(id)
    }).to.throw(/invalid/i)
    expect(function () {
      var id = 0
      ObjectId(id)
    }).to.throw(/invalid/i)
  })

  describe('.isValid', function () {
    it('validates ObjectIds as 24 character hex strings', function () {
      ObjectId.isValid('foo').should.equal(false)
      ObjectId.isValid('511083bb08ce6b1b00000003').should.equal(true)
      ObjectId.isValid('sdf').should.equal(false)
      ObjectId.isValid(123).should.equal(false)
      ObjectId.isValid(null).should.equal(false)
      ObjectId.isValid({}).should.equal(false)
      ObjectId.isValid(['foo']).should.equal(false)
    })

    it('validates itself', function () {
      ObjectId.isValid(ObjectId()).should.equal(true)
    })

    it('validates mongo native driver ObjectIds', function () {
      ObjectId.isValid(new NativeObjectId).should.equal(true)
    })

    it('false for 1-element array of ObjectId', function () {
      ObjectId.isValid([ObjectId()]).should.equal(false)
    })

  })

  describe('.equals', function () {
    it('returns true if oidA and oidB are the same instance', function () {
      var oidA = ObjectId()
      var oidB = oidA
      ObjectId.equals(oidA, oidB).should.equal(true)
    })
    it('returns true if oidA and oidB are stringwise equal', function () {
      var oidA = ObjectId('511083bb08ce6b1b00000003')
      var oidB = '511083bb08ce6b1b00000003'
      ObjectId.equals(oidA, oidB).should.equal(true)
    })
    it('returns false if A or B are not ObjectIds', function () {
      ObjectId.equals('sdfsdfsdfsdf', testOid).should.equal(false)
      ObjectId.equals('511083bb08ce6b1b00000003', ['511083bb08ce6b1b00000003']).should.equal(false)
    })
    it('is also on ObjectId.prototype', function () {
      var oidA = ObjectId()
      var oidB = oidA
      oidA.equals(oidB).should.equal(true)
    })
    it('curries arguments', function () {
      var oidA = ObjectId()
      var eq = ObjectId.equals(oidA)
      eq.should.be.a('function')
      eq('sdfsdf').should.equal(false)
      eq(oidA).should.equal(true)
    })
  })

  describe('.tryParse', function () {
    it('returns false if the first argument cannot be cast to an objectId', function () {
      var out = {}
      ObjectId.tryParse('sdfsdf', out, 'oid').should.equal(false)
    })
    it('returns true and casts the oid to the out object if possible', function () {
      var out = {}
      ObjectId.tryParse('511083bb08ce6b1b00000003', out, 'oid').should.equal(true)
      out.oid.should.be.instanceof(ObjectId.constructor)
      out.oid.toString().should.equal('511083bb08ce6b1b00000003')
    })
    it('returns false if trying to parse an empty objectId', function () {
      var out = {}
      ObjectId.tryParse(undefined, out, 'oid').should.equal(false)
    })
    it('returns true for a native ObjectId', function () {
      var out = {}
      var oid = new NativeObjectId()
      ObjectId.tryParse(oid, out, 'oid').should.equal(true)

    })
  })

})