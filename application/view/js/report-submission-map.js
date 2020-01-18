/*
Evan Guan
Course: CSc 648 Software Engineering Summer 2019 Team 2

Manage the map on the report submission page
Add a dragable pin and extract its coordinates every time it is moved
*/

// The current saved coordinates of the center of the map. San Francisco coordinates.
var curLatLng = {
  lat: 37.7749,
  lng: -122.4194
}
// The map object itself.
var map
// The draggable marker.
var marker
// The boundaries of the map.
var SAN_FRANCISCO_MAP_BOUNDS = {
  north: 37.85,
  south: 37.68,
  west: -122.58,
  east: -122.30
}
// The variable used to track whether or not the marker is in the vicinity of San Francisco.
var boolMarkerInSF = false
// The vertices describing a polygon that very roughly overlays San Francisco.
// Used for limiting bounds for marker placement.
var sanFranciscoOutlineCoords = [{
  lat: 37.808061,
  lng: -122.525104
},
{
  lat: 37.695,
  lng: -122.512095
},
{
  lat: 37.695,
  lng: -122.339398
},
{
  lat: 37.857020,
  lng: -122.355358
},
{
  lat: 37.808061,
  lng: -122.525104
}
]

// Includes casting to enforce typing, just in case.
// Takes a hash entry, formatted as {lat: float, lng: float}
// See associated html for example of calling this function with two numbers.
function setNewCenterLatLng (newLatLng) {
  try {
    if (newLatLng instanceof google.maps.LatLng) {
      this.curLatLng.lat = parseFloat(newLatLng.lat())
      this.curLatLng.lng = parseFloat(newLatLng.lng())
    } else {
      this.curLatLng.lat = parseFloat(newLatLng.lat)
      this.curLatLng.lng = parseFloat(newLatLng.lng)
    }
  } catch (e) {

  }
}

// Function locates the map div and fills it with the map.
function initMap () {
  // Initiate map centered on SF by default.
  map = new google.maps.Map(document.getElementById('map'), {
    center: curLatLng,
    // The map boundaries.
    restriction: {
      latLngBounds: SAN_FRANCISCO_MAP_BOUNDS,
      strictBounds: true
    },
    zoom: 12, // Bigger number = higher zoom. Float values accepted.
    gestureHandling: 'greedy', // Enable mousewheel zoom.
    streetViewControl: false, // Disable street view.
    mapTypeId: 'roadmap', // Hybrid map (satellite + roads).
    styles: [{ // This styling removes points of interest to declutter the map.
      featureType: 'poi',
      stylers: [{
        visibility: 'off'
      }]
    }]
  })

  setNewCenterLatLng({
    lat: 37.7556302,
    lng: -122.4296997
  })

  // Finally, create the draggable marker at the center of the map.
  marker = new google.maps.Marker({
    title: 'Place me where the hazard is please!',
    position: curLatLng,
    draggable: true,
    map: this.map
  })

  // Initialize some things here for validation usage.
  boolMarkerInSF = isMarkerInPolygonBoundary(curLatLng.lat, curLatLng.lng, sanFranciscoOutlineCoords)
  document.forms['report-submission-form'].elements['loc_lat'].value = curLatLng.lat
  document.forms['report-submission-form'].elements['loc_long'].value = curLatLng.lng

  // Add listners to the marker so we can trigger changes to values and move the map.
  google.maps.event.addListener(marker, 'dragend', function (evt) {
    // Check bounds of marker. If the user tried to move the marker out of the viewable area of the map,
    // set its position to be inside of the boundary.
    var newLat = evt.latLng.lat()
    var newLng = evt.latLng.lng()
    // too far north
    if (newLat > SAN_FRANCISCO_MAP_BOUNDS.north) {
      newLat = SAN_FRANCISCO_MAP_BOUNDS.north - 0.02
    }
    // too far south
    else if (newLat < SAN_FRANCISCO_MAP_BOUNDS.south) {
      newLat = SAN_FRANCISCO_MAP_BOUNDS.south + 0.02
    }
    // too far east
    if (newLng > SAN_FRANCISCO_MAP_BOUNDS.east) {
      newLng = SAN_FRANCISCO_MAP_BOUNDS.east - 0.02
    }
    // too far west
    else if (newLng < SAN_FRANCISCO_MAP_BOUNDS.west) {
      newLng = SAN_FRANCISCO_MAP_BOUNDS.west + 0.02
    }

    // After checking bounds, set the new position of the marker.
    marker.setPosition(
      new google.maps.LatLng(
        newLat,
        newLng
      )
    )

    // Check whether or not the marker is in the vicinity of San Francisco. Set result to this value.
    boolMarkerInSF = isMarkerInPolygonBoundary(newLat, newLng, sanFranciscoOutlineCoords)

    // DOM calls to set form values.
    var validMarkerLocationMessage = 'The marker is in a valid location, thank you!'
    var invalidMarkerLocationMessage = 'The marker is in an invalid location.<br>Please place it closer to San Francisco.'
    if(boolMarkerInSF) {
      document.getElementById('coordinatesValidity').innerHTML =
        '<p style=\'color: green\'>' + validMarkerLocationMessage + '</p>'
    } else {
      document.getElementById('coordinatesValidity').innerHTML =
        '<p style=\'color: red\'>' + invalidMarkerLocationMessage + '</p>'
    }

    document.forms['report-submission-form'].elements['loc_lat'].value = newLat
    document.forms['report-submission-form'].elements['loc_long'].value = newLng

    // Set the center of the map to be the same as the new marker position, if possible.
    setNewCenterLatLng(marker.position)
    this.map.setCenter({
      lat: newLat,
      lng: newLng
    })
    marker.setMap(map)
  })

  google.maps.event.addListener(marker, 'dragstart', function (evt) {
    // document.getElementById('currentCoords').innerHTML = '<p>Currently dragging marker...</p>'
    curLatLng = marker.position
  })
}

// This function determines whether a marker is in a specified polygon.
// USAGE: var markerInSF = isMarkerInPolygonBoundary(Number lat, Number lng, Array[{Number lat, Number lng}] sanFranciscoOutlineCoords);
// Receives lat/lng and set of polygon vertices.
// Returns true/false.
function isMarkerInPolygonBoundary (markerLat, markerLng, outlineCoords) {
  var boundsPoly = new google.maps.Polygon({
    paths: outlineCoords
  })
  var googleLatLngDatatype = new google.maps.LatLng(markerLat, markerLng)
  return google.maps.geometry.poly.containsLocation(googleLatLngDatatype, boundsPoly)
}

// Callable function to get if the marker is in SF vicinity.
function getIsMarkerInSF () {
  boolMarkerInSF = isMarkerInPolygonBoundary(curLatLng.lat, curLatLng.lng, sanFranciscoOutlineCoords)
  return boolMarkerInSF
}
