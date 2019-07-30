var curLatLng = {lat: 37.7749, lng: -122.4194}
var map;
var marker;

function setNewCenterLatLng(newLatLng) {
  curLatLng.lat = Number(newLatLng.lat);
  curLatLng.lng = Number(newLatLng.lng);
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: curLatLng,
    zoom: 16, // Bigger number = higher zoom. Float values accepted.
    draggable: false, // Make the map undraggagle.
    mapTypeId: 'hybrid'
  });

  marker = new google.maps.Marker({
    title: 'This is where the hazard is!',
    position: curLatLng,
    draggable: false,
    map: this.map
  });
}
