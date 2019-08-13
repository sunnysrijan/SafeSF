/*
Written by: Evan Guan
Course: CSc 648 Software Engineering Summer 2019 Team 2
*/

// The current saved coordinates of the center of the map. San Francisco coordinates.
var curLatLng = { lat: 37.7749, lng: -122.4194 }
// The map object itself.
var map
// The draggable marker.
var marker

// Includes casting to enforce typing, just in case.
// Takes a hash entry, formatted as {lat: float, lng: float}
// See associated html for example of calling this function with two numbers.
function setNewCenterLatLng (newLatLng) {
  curLatLng.lat = Number(newLatLng.lat)
  curLatLng.lng = Number(newLatLng.lng)
}

// Function locates the map div and fills it with the map.
function initMap () {
  // Initiate map centered on SF by default.
  map = new google.maps.Map(document.getElementById('map'), {
    center: curLatLng,
    zoom: 16, // Bigger number = higher zoom. Float values accepted.
    draggable: false, // Make the map undraggagle.
    mapTypeId: 'hybrid'
  })

  // Create the marker on the map.
  marker = new google.maps.Marker({
    title: 'This is where the hazard is!',
    position: curLatLng,
    draggable: false,
    map: this.map
  })
}

function showStartCoords () {
  document.getElementById('startCoords').innerHTML = '<p>Default LatLng (San Francisco): ' +
    curLatLng.lat + ', ' + curLatLng.lng + '</p>'
}

function showReportCoords () {
  document.getElementById('reportCoords').innerHTML = '<p>Report LatLng (SFSU): ' +
    curLatLng.lat + ', ' + curLatLng.lng + '</p>'
}
