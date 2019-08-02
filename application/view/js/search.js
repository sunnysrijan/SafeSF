var categories;
var locations;
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
        north: 37.84,
        south: 37.70,
        west: -122.53,
        east: -122.35,
      };

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

function populateDropdown(jsonData, field) {
  if (field === "category")
    var dropDown = document.getElementById("categoryDropDown");
  else if (field === "location")
    var dropDown = document.getElementById("locationDropDown");

  var div = document.createElement("div");
  div.innerHTML = "<a href='javascript:void(0);' onclick=\"selectDropdown('None', '" + field + "')\">None</a>";
  dropDown.appendChild(div);

  for (var i = 0; i < jsonData.length; i++) {
    if (field === "category")
      var selection = jsonData[i].category;
    else if (field === "location")
      var selection = jsonData[i].location;

    div = document.createElement("div");
    div.innerHTML = "<a href='javascript:void(0);' onclick=\"selectDropdown('" + selection + "', '" + field + "')\">" + selection + "</a>";
    dropDown.appendChild(div);
  }
}

function selectDropdown(selection, field) {
  if (field === "category")
    var dropDownButton = "categoryButton";
  else if (field === "location")
    var dropDownButton = "locationButton";

  var button = document.getElementById(dropDownButton);

  if (selection === "None") {
    if (field === "category")
      button.innerHTML = "Categories";
    else if (field === "location")
      button.innerHTML = "Locations";
  } else
    button.innerHTML = selection;
}

function search() {
  var xmlReq = new XMLHttpRequest();

  xmlReq.onload = function() {
    if (xmlReq.status == 200)
      createTable(xmlReq.response);
  }

  xmlReq.open('GET', '/search' + getSearchParams(), true);
  xmlReq.responseType = "json";
  xmlReq.send(null);
}

function getSearchParams() {
  var category = document.getElementById("categoryButton").innerHTML;
  var category_id = getIdOfValue(categories, "category", category);

  var location = document.getElementById("locationButton").innerHTML;
  var location_id = getIdOfValue(locations, "location", location);

  var user_entry = document.getElementById("searchBox").value;

  var requestParam = "?"
  var firstParam = true;

  if (category != "Categories") {
    requestParam += "category_id=" + category_id;
    firstParam = false;
  }

  if (location != "Locations") {
    if (!firstParam)
      requestParam += "&";

    requestParam += "location_id=" + location_id;
    firstParam = false;
  }

  if (user_entry != "") {
    if (!firstParam)
      requestParam += "&";

    requestParam += "user_entry=" + user_entry;
  }

  return requestParam;
}

function getIdOfValue(jsonData, field, value) {
  for (var i = 0; i < jsonData.length; i++) {
    if (field === "category") {
      if (jsonData[i].category === value)
        return jsonData[i].category_id;
    } else if (field === "location") {
      if (jsonData[i].location === value)
        return jsonData[i].location_id;
    }
  }
}

function getValueOfId(jsonData, field, id) {
  for (var i = 0; i < jsonData.length; i++) {
    if (field === "category_id") {
      if (jsonData[i].category_id === id)
        return jsonData[i].category;
    } else if (field === "location_id") {
      if (jsonData[i].location_id === id)
        return jsonData[i].location;
    }
  }
}

function createTable(searchResults) {
  var table = document.createElement("table");

  for (var i = 0; i < Math.ceil(searchResults.length); i++) {
    var row = table.insertRow(-1);

    var cell = row.insertCell(-1);

    var report = searchResults[i];
    var category = getValueOfId(categories, "category_id", report.category_id);
    var image = "report_images/" + report.report_id + ".jpg";

    if (locations[parseInt(report.location_id) - 1] == null)
      var location = "";
    else
      var location = getValueOfId(locations, "location_id", report.location_id);

    cell.innerHTML = "<div onclick=\"viewReports('" + report.report_id + "')\" class='card'>" +
      "<img class='cardImage' src='" + image + "'><div>" +
      category + "</div><div>" +
      report.details + "</div><div>" +
      location + "</div><div>" +
      report.insert_date + "</div><div>" +
      report.status + "</div></div>";

    // Add marker for map using this result.
    // addReportMarkerToMap(reportCategory, reportCategoryID, reportThumbnail, reportDetails, reportID, markerLat, markerLng)
    addReportMarkerToMap(category, report.category_id, image, report.details, report.report_id, report.loc_lat, report.loc_long);
  }

  var tableContainer = document.getElementById("table");
  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);
}

function viewReports(report_id) {
  window.location.href = "/reportDetails?report_id=" + report_id;
}

// Includes casting to enforce typing, just in case.
function setNewCenterLatLng(newLatLng) {
  curLatLng.lat = Number(newLatLng.lat);
  curLatLng.lng = Number(newLatLng.lng);
}

// Function locates the map div and fills it with the map.
function initMap() {
  // Function calls to get the lat/lng of the place we are interested in. SF by default.
  map = new google.maps.Map(document.getElementById('map'), {
    center: curLatLng,
    // The map boundaries.
    restriction: {
      latLngBounds: SAN_FRANCISCO_MAP_BOUNDS,
      strictBounds: false,
    },
    zoom: 12.2,
    mapTypeId: 'hybrid',
    // This styling removes points of interest to declutter the map.
    styles: [{
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
  var infoWindowReportURL = '/reports?report_id=' + reportID; // The full url of the report.
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
    pixelOffset: 15,
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
    // Pan the map back to the center of SF and zoom out.
    map.panTo({
      lat: 37.7749,
      lng: -122.4194
    });
    map.setZoom(12);
  });

  // Click on marker behavior.
  newMarker.addListener('click', function() {
    // Close the previously opened infoWindow if one has been opened.
    if(lastOpenedInfowindow) {
      lastOpenedInfowindow.close();
    }
    // Set the previous infoWindow to this one.
    lastOpenedInfowindow = infoWindow;

    // Open the infoWindow popup, pan to it, and zoom.
    infoWindow.open(this.map, newMarker);
    map.panTo(newMarker.position);
    map.setZoom(18);
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
