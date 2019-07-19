/*
Written by: Evan Guan
Course: CSc 648 Software Engineering Summer 2019 Team 2
*/

// The current saved coordinates of the center of the map.
var curLatLng = {lat: 37.783, lng: -122.416}
// The map object itself.
var map;
// A list of marker objects.
var marker;
// The geocoder object.
var geocoder;

function getCurLat() {
  return Number(curLatLng.lat);
}

function getCurLng() {
  return Number(curLatLng.lng);
}

function setCurLat(newLat) {
  curLatLng.lat = Number(newLat);
}

function setCurLng(newLng) {
  curLatLng.lng = Number(newLng);
}

function setNewLatLng(newLat, newLng) {
  setCurLat(Number(newLat));
  setCurLng(Number(newLng));
}

/* Function locates the map div and fills it with the map. */
function initMap() {
  /* Function calls to get the lat/lng of the place we are interested in. SF by default. */
  map = new google.maps.Map(document.getElementById('map'), {
    center: curLatLng,
    zoom: 12.1,
    mapTypeId: 'roadmap'
  });

  /* We can initialize the geocoder after we have a map */
  this.geocoder = new google.maps.Geocoder();

  /* Then a marker is placed at the lat/lng. */
  marker = new google.maps.Marker({position: {lat: getCurLat(), lng: getCurLng()}, map: map});
  console.log('Marker 1 added.')
  marker = new google.maps.Marker({position: {lat: getCurLat() + .001, lng: getCurLng() + .001}, map: this.map});
  console.log('Marker 2 added.')
  marker = new google.maps.Marker({position: {lat: getCurLat() + .002, lng: getCurLng() + .002}, map: map});
  console.log('Marker 3 added.')
}

/* Essentially the same as initializing the map, but with a different zoom level and hybrid view. */
function updateMap() {
  /* Function calls to get the lat/lng of the place we are interested in. SF by default. */
  map = new google.maps.Map(document.getElementById('map'), {
    center: curLatLng,
    zoom: 18,
    mapTypeId: 'hybrid'
  });
  /* Then a marker is placed at the lat/lng. */
  marker = new google.maps.Marker({
    position: {lat: getCurLat(), lng: getCurLng()},
    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    map: map
  });
  console.log('Map updated.')
  addMarkerToMap('Mile Rock Beach, San Francisco');
}

/* Adds a marker to the map, given coordinates or place name. */
function addMarkerToMap(newMarkerCoords) {
  /* Check to see if the var we get is a string.
  If it is, try to convert it to a coordinate. */
  if(typeof(newMarkerCoords) === 'string') {
    newMarkerCoords = geocodeAddress(newMarkerCoords);
  }
  /* Now, create the new marker. */
  marker = new google.maps.Marker({
    position: newMarkerCoords,
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    map: this.map
  });

  /* Testing using coordinates in a for loop. TEST OUTPUT OK. */
  /*
  for (i = 0; i < 5; i++)
  {
    var curCoord = this.curLatLong;
    marker = new google.maps.Marker({
      position: {lat: getCurLat() + (i * 0.0001), lng: getCurLng() + (i * 0.0001)},
      map: map
    });
  }
  */
}

/* Uses Google's geocoding service to return the coordinates of a string placename. */
function geocodeAddress(locationNameString) {
  var locationName = String(locationNameString);
  geocoder.geocode({'address': locationName}, function(results, status) {
    if (status === 'OK') {
      // this.map.setCenter(results[0].geometry.location); // Recenter the map on the new marker.
      this.marker = new google.maps.Marker({
        position: results[0].geometry.location,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        map: this.map,
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
