var curLatLng = {lat: 37.7749, lng: -122.4194}

function initMap() {
  // Initiate map centered on SF by default.
  map = new google.maps.Map(document.getElementById('map'), {
    center: curLatLng,
    zoom: 12,
    mapTypeId: 'hybrid'
  });
}
