/*
Written by: Evan Guan
Course: CSc 648 Software Engineering Summer 2019 Team 2
*/

var curLatLng = {lat: 37.783, lng: -122.416}
var map;
var marker;

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

/* Function locates the map div and fills it with the map. */
function initMap() {
  /* Function calls to get the lat/lng of the place we are interested in. SF by default. */
  map = new google.maps.Map(document.getElementById('map'), {
    center: curLatLng,
    zoom: 12.1
  });
  /* Then a marker is placed at the lat/lng. */
  marker = new google.maps.Marker({position: {lat: getCurLat(), lng: getCurLng()}, map: map});
  console.log('Map loading finished.')
}

/* Essentially the same as initializing the map, but with a different zoom level. */
function updateMap() {
  /* Function calls to get the lat/lng of the place we are interested in. SF by default. */
  map = new google.maps.Map(document.getElementById('map'), {
    center: curLatLng,
    zoom: 20
  });
  /* Then a marker is placed at the lat/lng. */
  marker = new google.maps.Marker({position: {lat: getCurLat(), lng: getCurLng()}, map: map});
  console.log('Map updated.')
}

function setNewLatLng(newLat, newLng)
{
  setCurLat(37.787993);
  setCurLng(-122.505875);
}

console.log(getCurLat(), getCurLng());
