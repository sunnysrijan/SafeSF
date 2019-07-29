/*
Written by: Evan Guan
Course: CSc 648 Software Engineering Summer 2019 Team 2
*/

// DEMO FROM: https://stackoverflow.com/questions/5290336/getting-lat-lng-from-google-marker

// The current saved coordinates of the center of the map. San Francisco coordinates.
var curLatLng = {lat: 37.7749, lng: -122.4194}
// The map object itself.
var map;
// The draggable marker.
var marker;

// The coordinates indicating the nodes of a polygon that outline San Francisco.
var sanFranciscoOutlineCoords = [
    {lat: 37.808061, lng: -122.525104},
    {lat: 37.704889, lng: -122.512095},
    {lat: 37.704889, lng: -122.339398},
    {lat: 37.857020, lng: -122.355358}
  ];

// Includes casting to enforce typing, just in case.
function setNewCenterLatLng(newLatLng) {
  // console.log("Setting new center on: " + newLatLng.lat() + ", " + newLatLng.lng());
  this.curLatLng.lat = parseFloat(newLatLng.lat());
  this.curLatLng.lng = parseFloat(newLatLng.lng());

  // console.log("Finished setting curLatLng: " + this.curLatLng.lat + ", " + this.curLatLng.lng);
}

/* Function locates the map div and fills it with the map. */
function initMap() {
  /* Function calls to get the lat/lng of the place we are interested in. SF by default. */
  map = new google.maps.Map(document.getElementById('map'), {
    center: curLatLng,
    zoom: 12,
    mapTypeId: 'hybrid'
  });

  /* We can initialize the geocoder after we have a map */
  this.geocoder = new google.maps.Geocoder();

  /* Finally, create the draggable marker at the center of the map. */
  marker = new google.maps.Marker({
    title: 'Place me where the hazard is please!',
    position: curLatLng,
    draggable: true,
    map: this.map
  });

  // Initialize the readout elements.
  document.getElementById('currentCoords').innerHTML = '<p>Marker dropped: Current Lat: ' +
    marker.position.lat().toFixed(5) + ' Current Lng: ' + marker.position.lng().toFixed(5) + '</p>';
  document.getElementById('isMarkerInSF').innerHTML = '<p>Marker is in general vicinity of San Francisco: ' +
    true + '</p>';

  // Add listners to the marker so we can trigger changes to values and move the map.
  google.maps.event.addListener(marker, 'dragend', function(evt) {
    document.getElementById('currentCoords').innerHTML = '<p>Marker dropped: Current Lat: ' +
      evt.latLng.lat().toFixed(5) + ' Current Lng: ' + evt.latLng.lng().toFixed(5) + '</p>';
    setNewCenterLatLng(marker.position);

    this.map.setCenter(marker.position);
    marker.setMap(map);

    // Check to see if the marker is dropped down in a valid location.
    // We send two Numbers, lat and lng.
    var markerInSF = isMarkerInPolygonBoundary(curLatLng.lat, curLatLng.lng, sanFranciscoOutlineCoords);
    var boolMarkerInSF = "true" ? markerInSF : "false";
    document.getElementById('isMarkerInSF').innerHTML = '<p>Marker is in general vicinity of San Francisco: ' +
      boolMarkerInSF + '</p>';

    console.log(curLatLng);
  });

  google.maps.event.addListener(marker, 'dragstart', function(evt){
    document.getElementById('currentCoords').innerHTML = '<p>Currently dragging marker...</p>';
    curLatLng = marker.position;
  });
}

// This function determines whether a marker is in a specified polygon.
// Receives lat/lng and set of polygon nodes.
// var sanFranciscoOutlineCoords = [
//     {lat: 37.808061, lng: -122.525104},
//     {lat: 37.704889, lng: -122.512095},
//     {lat: 37.704889, lng: -122.339398},
//     {lat: 37.857020, lng: -122.355358}
//   ];
// Returns true/false.
function isMarkerInPolygonBoundary(markerLat, markerLng, outlineCoords) {
  var boundsPoly = new google.maps.Polygon({paths: outlineCoords});
  var googleLatLngDatatype = new google.maps.LatLng(markerLat, markerLng);
  // console.log("our lat lng var: " + markerLat + ", " + markerLng);
  // console.log("google lat lng var: " + googleLatLngDatatype);
  return google.maps.geometry.poly.containsLocation(googleLatLngDatatype, boundsPoly);
}
