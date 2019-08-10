const db = require('../auth/db_config.js')
const db_categories = require('./categories.js')
const db_locations = require('./locations.js')
const validator = require('validator')

// Terms for bounds checking. Query once on server start to save time and communicaiton.
var numberOfCategories
var numberOfLocations
const maxDetailsVarcharAmount = 300
const maxUserIDVarcharAmount = 100
const maxImageRefVarcharAmount = 100

db_categories.getNumberOfCategories()
  .then(function (numCategories) {
    numberOfCategories = String(numCategories)
})

db_locations.getNumberOfLocations()
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

// This function determines whether a marker is in the general vicinity of San Francisco.
// Receives lat/lng.
// Returns true/false.
exports.isMarkerInSFRectangleBoundary = function (markerLat, markerLng) {
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

exports.validateSubmissionForm = function (reqBody) {
  var body = reqBody
  var validationPassed = true

  // Testing category_id
  if (validator.isInt(body['category_id'] + '', {min: 1, max: parseInt(numberOfCategories), allow_leading_zeroes: true})) {
    console.log('category_id ' + body['category_id'] + ' pass')
  } else {
    console.log('category_id ' + body['category_id'] + ' fail')
    validationPassed = false
  }

  // Testing category_id
  if (validator.isInt(body['location_id'] + '', {min: 1, max: parseInt(numberOfLocations), allow_leading_zeroes: true})) {
    console.log('location_id ' + body['location_id'] + ' pass')
  } else {
    console.log('location_id ' + body['location_id'] + ' fail')
    validationPassed = false
  }

  // Testing details
  if (validator.isLength(body['details'] + '', {min: 0, max: parseInt(maxDetailsVarcharAmount)})) {
    console.log('details ' + body['details'] + ' pass')
  } else {
    console.log('details ' + body['details'] + ' fail')
    validationPassed = false
  }

  // Testing loc_lat
  if (validator.isFloat(body['loc_lat'] + '', {locale: 'en-US'})) {
    console.log('loc_lat ' + body['loc_lat'] + ' pass')
  } else {
    console.log('loc_lat ' + body['loc_lat'] + ' fail')
    validationPassed = false
  }

  // Testing loc_long
  if (validator.isFloat(body['loc_long'] + '', {locale: 'en-US'})) {
    console.log('loc_long ' + body['loc_long'] + ' pass')
  } else {
    console.log('loc_long ' + body['loc_long'] + ' fail')
    validationPassed = false
  }

  // Check rough bounds of coordinates.
  var coordsValid = this.isMarkerInSFRectangleBoundary(parseFloat(body['loc_lat']), parseFloat(body['loc_long']))
  if (coordsValid) {
    console.log('coord in SF: pass')
  } else {
    console.log('coord in SF: fail')
    validationPassed = false
  }

  // Testing user_id
  if (validator.isLength(body['user_id'] + '', {min: 1, max: parseInt(maxUserIDVarcharAmount)})) {
    console.log('user_id ' + body['user_id'] + ' pass')
  } else {
    console.log('user_id ' + body['user_id'] + ' fail')
    validationPassed = false
  }

  // Testing image_ref
  if (validator.isLength(body['image_ref'] + '', {min: 1, max: parseInt(maxImageRefVarcharAmount)})) {
    console.log('image_ref ' + body['image_ref'] + ' pass')
  } else {
    console.log('image_ref ' + body['image_ref'] + ' fail')
    validationPassed = false
  }

  return validationPassed
}
