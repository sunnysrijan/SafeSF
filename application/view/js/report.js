// the lat/lng of San Francisco.
var curLatLng = {
  lat: 37.7749,
  lng: -122.4194
}
var map; // The Google Map object.
var marker; // The marker indicating the hazard's location.
var thisReportID; // This report's unique ID.
var categories; // Holds the categories from the database.
var locations; // Holds the location names from the database.

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

function resizeMap() {
  var rowHeight = document.getElementById('report-image').offsetHeight;
  // console.log("row height: " + document.getElementById('report-image').offsetHeight);
  document.getElementById('map').style.height = rowHeight + "px";
}

// Gets the report details from the DB, given a usable report_id.
function getReport() {
  var xmlReq = new XMLHttpRequest();

  xmlReq.onload = function() {
    if (xmlReq.status == 200)
      populateFields(xmlReq.response);
  }

  xmlReq.open('GET', "/reports?report_id=" + this.location.href.split("/").pop(), true);
  xmlReq.responseType = "json";
  xmlReq.send(null);
}

// Finds the report_id (in the page's url) and returns it.
function getSearchParams() {
  // Get the report id from the url.
  var requestParam = "?report_id=" + this.location.href.split("/").pop();
  console.log("Request param: " + requestParam);
  return requestParam;
}

// This function takes the given report and fills out the tagged elements in the html.
function populateFields(reportResults) {
  // Make a local var for readability.
  var report = reportResults;

  // Get the hazard category, hazard location, time of submission, report status, report_id, coordinates, and detailed comments.
  var hazardCategory = getValueOfId(categories, "category_id", report.category_id);
  var hazardLocation = (locations[parseInt(report.location_id) - 1] == null) ? "" : getValueOfId(locations, "location_id", report.location_id);
  var reportDate = report.insert_date;
  var reportUpdateDate = report.report_update_date;
  var reportStatus = report.status;
  var reportID = report.report_id;
  var reportDetails = report.details;

  // Now set the text elements.
  document.getElementById('hazard-type').innerHTML = hazardCategory;
  document.getElementById('hazard-location').innerHTML = hazardLocation;
  document.getElementById('report-date').innerHTML = reportDate;
  document.getElementById('report-update-date').innerHTML = reportUpdateDate;
  document.getElementById('report-status').innerHTML = reportStatus;
  document.getElementById('report-id').innerHTML = reportID;
  document.getElementById('report-details').innerHTML = reportDetails;

  // Set the map marker and move the map.
  var reportCoords = {lat: report.loc_lat, lng: report.loc_lng};
  marker.setPosition(reportCoords);
  this.map.setCenter(marker.position);
  marker.setMap(map);

  // Set the image.
  var image = "report_images/" + reportID + ".jpg";
  document.getElementById('report-image').src = reportDetails;
}

// Gets predetermined hazard categories from the database.
function getCategories() {
  var xmlReq = new XMLHttpRequest();

  xmlReq.onload = function() {
    if (xmlReq.status == 200) {
      categories = xmlReq.response
      populateDropdown(categories, "category");
    }
  }

  xmlReq.open('GET', '/categories', true);
  xmlReq.responseType = "json";
  xmlReq.send();
}

// Gets predetermined locations (neighborhoods, parks) from the database.
function getLocations() {
  var xmlReq = new XMLHttpRequest();

  xmlReq.onload = function() {
    if (xmlReq.status == 200) {
      locations = xmlReq.response
      populateDropdown(locations, "location");
    }
  }

  xmlReq.open('GET', '/locations', true);
  xmlReq.responseType = "json";
  xmlReq.send();
}
