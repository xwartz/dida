var ObjectId = require('bson').ObjectId

ObjectId.prototype.equals = function (oidB) {
  return equals(this, oidB)
}

var objIdPattern = /^[0-9a-fA-F]{24}$/;
var isValid = function (alleged) {
  return (Boolean(alleged) && !Array.isArray(alleged) && objIdPattern.test(String(alleged)))
}

var equals = function (oidA, oidB) {
  // curried
  if (arguments.length === 1) {
    return function (oidB) {
      return equals(oidA, oidB)
    }
  }

  if (oidA === oidB) { return true; }
  if (!isValid(oidA) || !isValid(oidB)) { return false }
  return (String(oidA) === String(oidB))
  return false;
}

var tryParse = function (oid, out, as) {
  if (!isValid(oid)) { return false }
  try {
    out[as] = Id(oid)
    return true
  } catch (e) {
    return false
  }
}

function Id(id) {
  if (id instanceof ObjectId) { return id }

  if (arguments.length === 0) {
    return new ObjectId()
  }

  id = String(id)

  if (isValid(id)) {
    return new ObjectId(id)

  } else {
    throw new Error('Invalid ObjectId: ' + id)
  }

}

module.exports = Id;
module.exports.constructor = ObjectId;
module.exports.tryParse = tryParse;
module.exports.equals = equals;
module.exports.isValid = isValid;
