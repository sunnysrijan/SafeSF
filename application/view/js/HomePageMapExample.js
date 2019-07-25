/*
Written by: Evan Guan
Course: CSc 648 Software Engineering Summer 2019 Team 2
*/

// The current saved coordinates of the center of the map.
var curLatLng = {lat: 37.7749, lng: -122.4194}
// The map object itself.
var map;
// A list of marker objects.
var marker;

// Includes casting to enforce typing, just in case.
function setNewCenterLatLng(newLatLng) {
  curLatLng.lat = Number(newLatLng.lat);
  curLatLng.lng = Number(newLatLng.lng);
}

/* Function locates the map div and fills it with the map. */
function initMap() {
  /* Function calls to get the lat/lng of the place we are interested in. SF by default. */
  map = new google.maps.Map(document.getElementById('map'), {
    center: curLatLng,
    zoom: 12,
    mapTypeId: 'hybrid'
  });

  setNewCenterLatLng({lat: 37.720993, lng: -122.475373});

  addExistingReportMarkersToMap();
}

/*
Adds a marker to the map, given coordinates or place name.
Modify the parameters to send this function data to use:
function addExistingReportMarkersToMap(reportTitle, reportHazardType, reportThumbnail, reportSummary, reportID, markerCoords, markerIconURL)
*/
function addExistingReportMarkersToMap() {
  // This data will be collected from the json returned by a DB query.
  var infoWindowTitle;          // The title of the report from the DB query json.
  var infoWindowHazardType;     // The type of hazard of the report from the DB query json.
  var infoWindowThumbnail;      // The thumbnail image of the report from the DB query json.
  var infoWindowSummary;        // The brief/truncated summary of the report from the DB query json.
  var infoWindowReportURL;      // The full url of the report.
                                // Likely will just be the report id appended to boilerplate url.
  var markerCoords;             // The hash {lat: float, lng:float} for the coordinates. See var curLatLng above for formatting.
  var markerIconURL;            // The url of the image to use for the marker icon.
                                // Icons from Google: https://sites.google.com/site/gmapsdevelopment/

  var infoWindowContentString;  // The string of html that will be in the popup for the marker on-click.

  // Hard coded example.
  infoWindowTitle = 'Generic Title Here';
  infoWindowHazardType = 'Oil Hazard Alert';
  infoWindowThumbnail = 'images/example-infowindow-thumbnail.png';
  infoWindowSummary = 'Large oil slick on intersection of Holloway and 19th avenue.';
  infoWindowReportURL = 'https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple';
  markerCoords = curLatLng;
  markerIconURL = 'http://maps.google.com/mapfiles/ms/micons/caution.png';

  // Dynamic code
  /*
  infoWindowTitle = reportTitle;
  infoWindowHazardType = reportHazardType + ' Alert';
  infoWindowThumbnail = reportThumbnail;
  infoWindowSummary = reportSummary;
  infoWindowReportURL = 'https://our.site.ip/reports/' + reportID;
  markerCoords = markerCoords;
  markerIconURL = markerIconURL;
  */

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

  // Now, create the new marker.
  marker = new google.maps.Marker({
    position: markerCoords,
    icon: markerIconURL,
    title: infoWindowHazardType,
    map: this.map
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}
