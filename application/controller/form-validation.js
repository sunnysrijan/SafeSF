const db = require('../auth/db_config.js')
const dropdowns = require('./dropdowns.js')
const validator = require('validator')

// Terms for bounds checking. Query once on server start to save time and communicaiton.
var numberOfCategories
var numberOfLocations

// ---------- THESE MUST BE CHANGED TO BE <= THE SIZE OF RELATED DB COLUMNS ----------
const maxDetailsVarcharAmount = 300
const maxUserIDVarcharAmount = 100
const maxUsernameVarcharAmount = 100
const maxEmailVarcharAmount = 100
const maxPasswordVarcharAmount = 100
const maxImageRefVarcharAmount = 100
// ---------- /THESE MUST BE CHANGED TO BE <= THE SIZE OF RELATED DB COLUMNS ----------

// Initial DB call to get the number of categories in the database at the time of startup.
dropdowns.getNumberOfCategories()
  .then(function (numCategories) {
    numberOfCategories = String(numCategories)
  })

// Initial DB call to get the number of locations in the database at the time of startup.
dropdowns.getNumberOfLocations()
  .then(function (numLocations) {
    numberOfLocations = String(numLocations)
  })

// The variable used to track whether or not the marker is in the vicinity of San Francisco.
var boolMarkerInSF
// The vertices describing a polygon that very roughly overlays San Francisco.
// Used for limiting bounds for marker placement.
const SAN_FRANCISCO_MAP_BOUNDS = {
  north: 37.83,
  south: 37.72,
  west: -122.56,
  east: -122.32
}

// ---------- START FORM-SPECIFIC VALIDATION FUNCTIONS ----------

// Validation code for the report submission form.
exports.validateReportSubmissionForm = function (reqBody) {
  var validationPassed = true

  // Test each element individually.
  if(!isCaptchaValid(reqBody) ||
     !isCategoryIDValid(reqBody) ||
     !isLocationIDValid(reqBody) ||
     !isDetailsValid(reqBody) ||
     !isLatitudeValid(reqBody) ||
     !isLongitudeValid(reqBody) ||
     !areCoordinatesInBounds(reqBody)) {
    return false
  }

  return validationPassed
}

// Validation code for the user registration form.
exports.validateRegistrationForm = function (reqBody) {
  var validationPassed = true

  // Test each element individually.
  if(!isCaptchaValid(reqBody) ||
     !isUsernameValid(reqBody) ||
     !isEmailValid(reqBody) ||
     !isNewPasswordValid(reqBody) &&
     ('agreedToTerms' in reqBody &&
      reqBody['agreedToTerms'] === 'on')) {
    return false
  }

  return validationPassed
}

// Validation code for the user login form.
exports.validateLoginForm = function (reqBody) {
  var validationPassed = true

  // Test each element individually.
  if(!isUsernameValid(reqBody) ||
     !isExistingPasswordValid(reqBody)) {
    return false
  }

  return validationPassed
}

// ---------- END FORM-SPECIFIC VALIDATION FUNCTIONS ----------


// ---------- START GENERIC VALIDATION FUNCTIONS ----------

// This function determines whether a marker is in the general vicinity of San Francisco.
// Receives lat/lng.
// Returns true/false.
function isMarkerInSFRectangleBoundary (markerLat, markerLng) {
  // console.log('checking: ', markerLat, ' ', typeof markerLat, ' ', markerLng, ' ', typeof markerLng)
  var inSF = true

  if (parseFloat(markerLat) > parseFloat(SAN_FRANCISCO_MAP_BOUNDS.north)) {
    inSF = false
  }
  if (parseFloat(markerLat) < parseFloat(SAN_FRANCISCO_MAP_BOUNDS.south)) {
    inSF = false
  }
  if (parseFloat(markerLng) > parseFloat(SAN_FRANCISCO_MAP_BOUNDS.east)) {
    inSF = false
  }
  if (parseFloat(markerLng) < parseFloat(SAN_FRANCISCO_MAP_BOUNDS.west)) {
    inSF = false
  }
  return inSF // If we make it here, everything should be ok.
}

// Testing for g-captcha-response
function isCaptchaValid (body) {
  if ('g-recaptcha-response' in body &&
      validator.isLength(body['g-recaptcha-response'] + '', { min: 100, max: 500 })) {
    console.log('g-recaptcha-response ' + ' pass')
    return true
  } else {
    console.log('g-recaptcha-response ' + ' fail')
    return false
  }
}

// Testing category_id
function isCategoryIDValid (body) {
  if ('category_id' in body &&
      validator.isLength(body['category_id'] + '', { min: 1, max: 2 }) &&
      validator.isInt(body['category_id'] + '', { min: 1, max: parseInt(numberOfCategories) })) {
    console.log('category_id ' + body['category_id'] + ' pass')
    return true
  } else {
    console.log('category_id ' + body['category_id'] + ' fail')
    return false
  }
}

// Testing category_id
function isLocationIDValid (body) {
  if ('location_id' in body &&
      validator.isLength(body['location_id'] + '', {min:1, max: 2 }) &&
      validator.isInt(body['location_id'] + '', { min: 1, max: parseInt(numberOfLocations) })) {
    console.log('location_id ' + body['location_id'] + ' pass')
    return true
  } else {
    console.log('location_id ' + body['location_id'] + ' fail')
    return false
  }
}

// Testing details
function isDetailsValid (body) {
  if ('details' in body &&
      validator.isLength(body['details'] + '', { min: 0, max: parseInt(maxDetailsVarcharAmount) })) {
    console.log('details ' + body['details'] + ' pass')
    return true
  } else {
    console.log('details ' + body['details'] + ' fail')
    return false
  }
}

// Testing loc_lat
function isLatitudeValid (body) {
  if ('loc_lat' in body &&
      validator.isLength(body['loc_lat'] + '', { min: 2, max: 20 }) &&
      validator.isFloat(body['loc_lat'] + '', { locale: 'en-US' })) {
    console.log('loc_lat ' + body['loc_lat'] + ' pass')
    return true
  } else {
    console.log('loc_lat ' + body['loc_lat'] + ' fail')
    return false
  }
}

// Testing loc_long
function isLongitudeValid (body) {
  if ('loc_long' in body &&
      validator.isLength(body['loc_long'] + '', { min: 2, max: 20 }) &&
      validator.isFloat(body['loc_long'] + '', { locale: 'en-US' })) {
    console.log('loc_long ' + body['loc_long'] + ' pass')
    return true
  } else {
    console.log('loc_long ' + body['loc_long'] + ' fail')
    return false
  }
}

// Check rough bounds of coordinates.
function areCoordinatesInBounds (body) {
  var coordsValid = isMarkerInSFRectangleBoundary(parseFloat(body['loc_lat']), parseFloat(body['loc_long']))
  if (coordsValid) {
    console.log('coord in SF: pass')
    return true
  } else {
    console.log('coord in SF: fail')
    return false
  }
}

// // Testing user_id Won't need this if we are using cookies for auth.
// // TODO: DB query
// function isNewUserIDValid (body) {
//   if ('user_id' in body &&
//       validator.isLength(body['user_id'] + '', { min: 1, max: 30 })) {
//     console.log('user_id ' + body['user_id'] + ' pass')
//     return true
//   } else {
//     console.log('user_id ' + body['user_id'] + ' fail')
//     validationPassed = false
//   }
// }


// ----- START GENERIC USER INFO VALIDATION FUNCTIONS -----
// Testing username
// TODO: DB query
function isUsernameValid (body) {
  if ('username' in body &&
      validator.isAlphanumeric(body['username'] + '', ['en-US'] ) &&
      validator.isLength(body['username'] + '', { min: 4, max: parseInt(maxUsernameVarcharAmount) })) {
    console.log('username ' + body['username'] + ' pass')
    return true
  } else {
    console.log('username ' + body['username'] + ' fail')
    return false
  }
}

// Testing email
// TODO: DB query
function isEmailValid (body) {
  if ('email' in body &&
      validator.isEmail(body['email'] + '') &&
      validator.isLength(body['email'] + '', { min: 5, max: parseInt(maxEmailVarcharAmount) })) {
    console.log('email ' + body['email'] + ' pass')
    return true
  } else {
    console.log('email ' + body['email'] + ' fail')
    return false
  }
}
// ----- END GENERIC USER INFO VALIDATION FUNCTIONS -----

// ----- START NEW USER INFO VALIDATION FUNCTIONS -----
// Testing new password
function isNewPasswordValid (body) {
  if ('password' in body &&
      'passwordConfirmation' in body &&
      validator.isLength(body['password'] + '', { min: 7, max: parseInt(maxPasswordVarcharAmount) }) &&
      validator.isLength(body['passwordConfirmation'] + '', { min: 7, max: parseInt(maxPasswordVarcharAmount) }) &&
      validator.equals(body['password'], body['passwordConfirmation'])) {
    console.log('password ' + body['password'] + ' pass')
    return true
  } else {
    console.log('password ' + body['password'] + ' fail')
    return false
  }
}
// ----- END NEW USER INFO VALIDATION FUNCTIONS -----

// ----- START EXISTING USER INFO VALIDATION FUNCTIONS -----
// Testing existing password
function isExistingPasswordValid (body) {
  if ('password' in body &&
      validator.isLength(body['password'] + '', { min: 7, max: parseInt(maxPasswordVarcharAmount) })) {
    console.log('password ' + body['password'] + ' pass')
    return true
  } else {
    console.log('password ' + body['password'] + ' fail')
    return false
  }
}
// ----- START EXISTING USER INFO VALIDATION FUNCTIONS -----

// ---------- START GENERIC VALIDATION FUNCTIONS ----------
