// the lat/lng of San Francisco.
var curLatLng = {
  lat: 37.7749,
  lng: -122.4194
}
var map // The Google Map object.
var marker // The marker indicating the hazard's location.
var thisReportID // This report's unique ID.
var categories // Holds the categories from the database.
var locations // Holds the location names from the database.

const urlParams = new URLSearchParams(window.location.search) // Parameter parser class.

// Includes casting to enforce typing, just in case.
// Takes a hash entry, formatted as {lat: float, lng: float}
// See associated html for example of calling this function with two numbers.
function setNewCenterLatLng (newLatLng) {
  try {
    if (newLatLng instanceof google.maps.LatLng) {
      this.curLatLng.lat = parseFloat(newLatLng.lat())
      this.curLatLng.lng = parseFloat(newLatLng.lng())
    } else {
      this.curLatLng.lat = parseFloat(newLatLng.lat)
      this.curLatLng.lng = parseFloat(newLatLng.lng)
    }
  } catch (e) {

  }
}

function initMap () {
  map = new google.maps.Map(document.getElementById('map'), {
    center: curLatLng,
    zoom: 16, // Bigger number = higher zoom. Float values accepted.
    streetViewControl: false, // Disable street view.
    draggable: false, // Make the map undraggagle.
    mapTypeId: 'hybrid',
    styles: [{ // This styling removes points of interest to declutter the map.
      featureType: 'poi',
      stylers: [{
        visibility: 'off'
      }]
    }]
  })
}

function resizeMap () {
  var rowHeight = document.getElementById('report-image').offsetHeight > 400 ? document.getElementById('report-image').offsetHeight : 400
  document.getElementById('map').style.height = rowHeight + 'px'
}

// Gets the report details from the DB, given a usable report_id.
function getReport () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) {
      populateFields(xmlReq.response)
    }
  }

  xmlReq.open('GET', '/getReport?report_id=' + getSearchParams(), true)
  xmlReq.responseType = 'json'
  xmlReq.send(null)
}

// Finds the report_id (in the page's url) and returns it.
function getSearchParams () {
  // Get the report id from the url.
  var report_id = urlParams.get('report_id')
  return report_id
}

// This function takes the given report and fills out the tagged elements in the html.
function populateFields (reportResults) {
  // Make a local var for readability.
  var report = reportResults[0]

  // Get the hazard category, hazard location, time of submission, report status, report_id, coordinates, and detailed comments.
  var hazardCategory = report.category
  var hazardLocation = report.location
  var reportDate = report.insert_date
  var reportUpdateDate = report.update_date
  var reportStatus = report.status
  var reportID = report.report_id
  var reportDetails = report.details

  // Now set the text elements.
  document.getElementById('hazard-type').innerHTML = hazardCategory
  document.getElementById('hazard-location').innerHTML = hazardLocation
  document.getElementById('report-date').innerHTML = reportDate
  document.getElementById('report-update-date').innerHTML = reportUpdateDate
  document.getElementById('report-status').innerHTML = reportStatus
  document.getElementById('report-id').innerHTML = reportID
  document.getElementById('report-details').innerHTML = reportDetails

  // Setup report coordinates.
  var reportCoords = new google.maps.LatLng(
    report.loc_lat != null ? report.loc_lat : report.park_loc_lat,
    report.loc_long != null ? report.loc_long : report.park_loc_long
  )
  setNewCenterLatLng(reportCoords)

  // Initialize the map and marker. Pan and zoom.
  initMap()

  marker = new google.maps.Marker({
    title: 'This is where the hazard is!',
    position: reportCoords,
    draggable: false,
    map: this.map
  })

  marker.setPosition(reportCoords)
  this.map.setCenter(reportCoords)
  marker.setMap(map)

  // Set the image. Resize the map after loading the image.
  var image = document.getElementById('report-image')
  image.onload = function () {
    resizeMap()
  }
  image.src = 'report_images/' + report.report_id + '.jpg'
  // document.getElementById('report-image').image = image;
  // Resize the map since the new image may have a different size.
  resizeMap()
}
