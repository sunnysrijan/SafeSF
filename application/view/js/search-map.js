// The current saved coordinates of the center of the map.
var curLatLng = {
  lat: 37.7749,
  lng: -122.4194
}
// The map object itself.
var map;
// An array of marker objects.
var markers = [];
// Ref to the last opened infoWindow. Used for keeping the map uncluttered.
var lastOpenedInfowindow = null;
// The boundaries of the map.
var SAN_FRANCISCO_MAP_BOUNDS = {
  north: 37.85,
  south: 37.70,
  west: -122.53,
  east: -122.35,
};

// Includes casting to enforce typing, just in case.
// Takes a hash entry, formatted as {lat: float, lng: float}
// See associated html for example of calling this function with two numbers.
function setNewCenterLatLng(newLatLng) {
  try {
    if (newLatLng instanceof google.maps.LatLng) {
      this.curLatLng.lat = parseFloat(newLatLng.lat());
      this.curLatLng.lng = parseFloat(newLatLng.lng());
    } else {
      this.curLatLng.lat = parseFloat(newLatLng.lat);
      this.curLatLng.lng = parseFloat(newLatLng.lng);
    }
  } catch (e) {

  }
}

// Function locates the map div and fills it with the map.
function initMap() {
  // Initiate map centered on SF by default.
  map = new google.maps.Map(document.getElementById('map'), {
    center: curLatLng,
    // The map boundaries.
    restriction: {
      latLngBounds: SAN_FRANCISCO_MAP_BOUNDS,
      strictBounds: false,
    },
    zoom: 12.2, // Bigger number = higher zoom. Float values accepted.
    gestureHandling: 'greedy', // Enable mousewheel zoom.
    streetViewControl: false, // Disable street view.
    mapTypeId: 'hybrid',
    styles: [{ // This styling removes points of interest to declutter the map.
      "featureType": "poi",
      "stylers": [{
        "visibility": "off"
      }]
    }]
  });

  setNewCenterLatLng({
    lat: 37.720993,
    lng: -122.475373
  });
}

// Adds a marker to the map using given coordinates.
// Additionally adds an infoWindow popup to the marker with data from the parameters.
function addReportMarkerToMap(reportCategory, reportCategoryID, reportThumbnail, reportDetails, reportID, markerLat, markerLng) {
  // Get data from report and add it to variables to construct the html of the infoWindow.
  var infoWindowReportCategory = reportCategory; // The type of hazard of the report from the DB query json.
  var infoWindowReportThumbnail = reportThumbnail; // The thumbnail image of the report from the DB query json.
  var infoWindowReportDetails = reportDetails; // The details/comment of the report from the DB query json.
  var infoWindowReportURL = '/report?report_id=' + reportID; // The full url of the report.
  // Likely will just be the report id appended to boilerplate url.
  var newMarkerCoords = (markerLat != null && markerLng != null) ? {
    lat: markerLat,
    lng: markerLng
  } : {
    lat: 37.7749,
    lng: -122.4194
  } // The hash {lat: float, lng:float} for the coordinates. See var curLatLng above for formatting.
  var newMarkerIconURL = getMarkerIconURL(reportCategoryID); // Get the marker icon given the category_id of the current report.
  // Icons from Google: https://sites.google.com/site/gmapsdevelopment/

  // The string of html that will be in the popup for the marker on-click. It is essentially pure html.
  infoWindowContentString =
    '<div id="content">' +
    '<div id="bodyContent">' +
    '<p>' +
    '<b>' + infoWindowReportCategory + '</b><br>' +
    infoWindowReportDetails + '<br>' +
    '</p>' +
    '<p>' +
    '<a href="' + infoWindowReportURL + '">' +
    '<img src="' + infoWindowReportThumbnail + '" alt="Click for full report"' +
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

  // Create a new infoWindow object for this marker.
  var infoWindow = new google.maps.InfoWindow({
    content: infoWindowContentString,
    maxWidth: 400
  });

  // Now, create the new marker.
  var newMarker = new google.maps.Marker({
    position: newMarkerCoords,
    icon: newMarkerIconURL,
    title: infoWindowReportCategory,
    map: map
  });

  // Close infoWindow behavior.
  google.maps.event.addListener(infoWindow, 'closeclick', function() {
    // Zoom out and pan back to SF center.
    map.setZoom(12);
    map.panTo({
      lat: 37.7749,
      lng: -122.4194
    });
  });

  // Click on marker behavior.
  newMarker.addListener('click', function() {
    // Close the previously opened infoWindow if one has been opened.
    if (lastOpenedInfowindow) {
      lastOpenedInfowindow.close();
    }
    // Set the previous infoWindow to this one.
    lastOpenedInfowindow = infoWindow;

    // Open the infoWindow popup, zoom in, and pan to it.
    infoWindow.open(this.map, newMarker);
    map.setZoom(18);
    map.panTo(newMarker.position);
  });

  markers.push(newMarker);
}

// Given a hazard category (Number (int)), returns a string with an icon url.
function getMarkerIconURL(reportCategory) {
  var categoryAsInt;

  // Cast the category_id as an int and check range.
  try {
    categoryAsInt = parseInt(reportCategory);
    if (categoryAsInt < 0)
      throw ("category_id(int) < 0, expected int >= 0.")
  } catch (error) {
    console.error(error);
    return null;
  }

  var baseURL = 'http://maps.google.com/mapfiles/ms/micons/';

  // Assign and return the icon URL.
  switch (categoryAsInt) {
    case 1:
      return baseURL + "purple-dot.png";
      break;
    case 2:
      return baseURL + "orange-dot.png";
      break;
    case 3:
      return baseURL + "ltblue-dot.png";
      break;
    case 4:
      return baseURL + "red-dot.png";
      break;
    case 5:
      return baseURL + "green-dot.png";
      break;
    default:
  }
}
