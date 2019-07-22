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

function setNewCenterLatLng(newLat, newLng) {
  setCurLat(Number(newLat));
  setCurLng(Number(newLng));
}

function setNewCenterPlaceName(placeName) {
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
  addExistingReportMarkersToMap('Mile Rock Beach, San Francisco');
}

/*
Adds a marker to the map, given coordinates or place name.
Will potentially change to use a foreach internally to post all relevant markers.
*/
function addExistingReportMarkersToMap(newMarkerCoords) {
  var newMarker;    // Temp var that holds the new marker that we will add.
  var markerCoords = {lat: 0, lng: 0}; // The resolved coordinates of the marker.

  // This data will be collected from the json returned by a DB query.
  var infoWindowTitle;          // The title of the report from the DB query json.
  var infoWindowHazardType;     // The type of hazard of the report from the DB query json.
  var infoWindowThumbnail;      // The url of the thumbnail image of the report from the DB query json.
  var infoWindowSummary;        // The breif/truncated summary of the report from the DB query json.
  var infoWindowReportURL;      // The full url of the report.
                                // Likely will just be the report id appended to boilerplate url.
  var infoWindowContentString;  // The string of html that will be in the popup for the marker on-click.

  /* TODO:  Create functions to read json return from the DB and parse into the relevant vars.
            Do this before attempting to parse the coordinates, as that is an asyncronous api call.
  */

  // Hard coded example.
  infoWindowTitle = 'Generic Title Here';
  infoWindowHazardType = 'Oil Hazard Alert: ';
  infoWindowThumbnail = 'images/example-infowindow-thumbnail.png';
  infoWindowSummary = 'Large oil slick on intersection of Holloway and 19th avenue.';
  infoWindowReportURL = 'https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple';

  // Create the content string. It is essentially pure html.
  infoWindowContentString =
    '<div id="content">' +
      '<div id="siteNotice">' + '</div>' +
      '<h1 id="firstHeading" class="firstHeading">' + infoWindowTitle + '</h1>' +
      '<div id="bodyContent">' +
        '<p>' +
          '<b>' + infoWindowHazardType + '</b><br>' +
          infoWindowSummary + '<br>' +
        '</p>' +
        '<p>' +
          '<a href="' + infoWindowReportURL + '">' +
            '<img src="' + infoWindowThumbnail + '" alt="Click for full report"' +
            ' style="float:middle; width:96px; height:96px;" align="middle">' +
          '</a><br>' +
        '</p>' +
        '<p>' +
          '<a ' + 'href="' + infoWindowReportURL + '">' +
          '<b>Click here for full report.</b>' +
          '</a> ' +
        '</p>' +
      '</div>' +
    '</div>';

  // Create a new infowindow object for this marker.
  var infowindow = new google.maps.InfoWindow({
          content: infoWindowContentString
        });

  /* Check to see if the var we get is a string.
  If it is, try to convert it to a coordinate. */
  if(typeof(newMarkerCoords) === 'string') {
    geocodePlaceName(newMarkerCoords).then(function(resultCoords) {
      markerCoords = resultCoords;

      console.log('markerCoords: ', markerCoords);
      /* Now, create the new marker. */
      marker = new google.maps.Marker({
        position: markerCoords,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        title: infoWindowHazardType,
        map: this.map
      });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
    });
  } else {
    markerCoords = newMarkerCoords;

    console.log('markerCoords: ', markerCoords);
    // Now, create the new marker.
    marker = new google.maps.Marker({
      position: markerCoords,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      title: infoWindowHazardType,
      map: this.map
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  }
}

/* Uses Google's async geocoding service to return the coordinates of a string placename. */
function geocodePlaceName(locationNameString) {
  return new Promise(function(resolve, reject) {
    var locationName = String(locationNameString);
    geocoder.geocode({'address': locationName}, function(results, status) {
      if (status === 'OK') {
        // this.map.setCenter(results[0].geometry.location); // Recenter the map on the new marker.
        var results = {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()}
        console.log(results);
        resolve(results);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  });
}
