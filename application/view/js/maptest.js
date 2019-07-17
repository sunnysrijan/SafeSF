
var curLat = Number(37.783);
var curLng = Number(-122.416);
var map;
var marker;

function getCurLat() {
  return Number(curLat);
}

function getCurLng() {
  return Number(curLng);
}

function setCurLat(newLat) {
  curLat = Number(newLat);
}

function setCurLng(newLng) {
  curLng = Number(newLng);
}

/* Function locates the map div and fills it with the map. */
function initMap() {
  /* Function calls to get the lat/lng of the place we are interested in. SF by default. */
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: getCurLat(), lng: getCurLng()},
    zoom: 12.1
  });
  /* Then a marker is placed at the lat/lng. */
  marker = new google.maps.Marker({position: {lat: getCurLat(), lng: getCurLng()}, map: map});
  console.log('Map loading finished.')
}

function setNewLatLng(newLat, newLng)
{
  setCurLat(37.787993);
  setCurLng(-122.505875);
}

function updateMap() {
  /* Function calls to get the lat/lng of the place we are interested in. SF by default. */
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: getCurLat(), lng: getCurLng()},
    zoom: 12.1
  });
  /* Then a marker is placed at the lat/lng. */
  marker = new google.maps.Marker({position: {lat: getCurLat(), lng: getCurLng()}, map: map});
}

console.log(getCurLat(), getCurLng());
