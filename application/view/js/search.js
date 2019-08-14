const urlParams = new URLSearchParams(window.location.search) // Parameter parser class.

function search () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200)
      createTable(xmlReq.response)
  }

  xmlReq.open('GET', '/search' + getSearchParams(), true)
  xmlReq.responseType = 'json'
  xmlReq.send(null)
}

function getRecents() {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200)
      createRecentsTable(xmlReq.response)
  }

  xmlReq.open('GET', '/search', true)
  xmlReq.responseType = 'json'
  xmlReq.send(null)
}

function admin () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) 
      createTableAdmin(xmlReq.response)
  }

  xmlReq.open('GET', '/search?admin=true', true)
  xmlReq.responseType = 'json'
  xmlReq.send(null)
}

function setStatus(report_id, status) {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200)
      alert("Report Was Updated Successfully!")
    else
      alert("Report Could Not Be Updated")
  }

  xmlReq.open('POST', '/admin?reportID=' + report_id + '&status=' + status, true)
  xmlReq.responseType = 'json'
  xmlReq.send(null)
}

function getSearchParams () {
  var user_entry = document.getElementById('searchBox').value
  var category_id = document.getElementById('categoryDropDown').value
  var location_id = document.getElementById('locationDropDown').value
  var park_id = document.getElementById('parkDropDown').value

  var requestParam = '?'
  var firstParam = true

  if (user_entry != null && user_entry != '') {
    requestParam += 'user_entry=' + user_entry
    firstParam = false
  }

  if (category_id != null && category_id != -1) {
    if (!firstParam) {
      requestParam += '&'
    }

    requestParam += 'category_id=' + category_id
    firstParam = false
  }

  if (location_id != null && location_id != -1) {
    if (!firstParam) {
      requestParam += '&'
    }

    requestParam += 'location_id=' + location_id
    firstParam = false
  }

  if (park_id != null && park_id != -1) {
    if (!firstParam) {
      requestParam += '&'
    }

    requestParam += 'park_id=' + park_id
  }

  return requestParam
}

function filterResults() {
  window.location.href = "/search-results" + getSearchParams();
}

//Populate the searchbar and dropdowns with the values from the query
function populateSearchOptions() {
  document.getElementById('searchBox').value = urlParams.get('user_entry')

  if(urlParams.get('category_id') != null)
    document.getElementById('categoryDropDown').value = urlParams.get('category_id')

  if(urlParams.get('location_id') != null)
    document.getElementById('locationDropDown').value = urlParams.get('location_id')

  if(urlParams.get('park_id') != null)
    document.getElementById('parkDropDown').value = urlParams.get('park_id')
}

function getValueOfId (jsonData, field, id) {
  for (var i = 0; i < jsonData.length; i++) {
    if (field === 'category_id' && jsonData[i].category_id === id) {
      return jsonData[i].category
    } else if (field === 'location_id' && jsonData[i].location_id === id) {
      return jsonData[i].location
    }
  }
}

function createTable (searchResults) {
  var table = document.createElement('table')

  for (var i = 0; i < Math.ceil(searchResults.length); i++) {
    var row = table.insertRow(-1)
    var cell = row.insertCell(-1)

    var report = searchResults[i]
    var category = getValueOfId(categories, 'category_id', report.category_id)
    var image = 'report_images/' + report.report_id + '.jpg'

    if (locations[parseInt(report.location_id) - 1] == null) {
      var location = ''
    } else {
      var location = getValueOfId(locations, 'location_id', report.location_id)
    }

    cell.innerHTML = createCard(report, image, category, location, null)

    // Check for lat/lng. If it doesn't exit, then we need the coordinates of the park instead.
    var markerLat = report.loc_lat != null ? report.loc_lat : report.park_loc_lat
    var markerLng = report.loc_long != null ? report.loc_long : report.park_loc_long
    // Add marker for map using this result.
    // addReportMarkerToMap(reportCategory, reportCategoryID, reportThumbnail, reportDetails, reportID, markerLat, markerLng)
    addReportMarkerToMap(category, report.category_id, image, report.details, report.report_id, markerLat, markerLng)
  }

  var tableContainer = document.getElementById('table')
  tableContainer.innerHTML = ''
  tableContainer.appendChild(table)
}

function createRecentsTable (searchResults) {
  var table = document.createElement('table')
  var numReports = 10
  var max

  if(numReports > Math.ceil(searchResults.length))
    max = Math.ceil(searchResults.length)
  else
    max = numReports

  for (var i = max - 1; i >= 0; i--) {
    var row = table.insertRow(-1)
    var cell = row.insertCell(-1)

    var report = searchResults[i]
    var category = getValueOfId(categories, 'category_id', report.category_id)
    var image = 'report_images/' + report.report_id + '.jpg'

    if (locations[parseInt(report.location_id) - 1] == null) {
      var location = ''
    } else {
      var location = getValueOfId(locations, 'location_id', report.location_id)
    }

    cell.innerHTML = createCard(report, image, category, location, null)
  }

  var tableContainer = document.getElementById('table')
  tableContainer.innerHTML = ''
  tableContainer.appendChild(table)
}

function createTableAdmin (searchResults) {
  var table = document.createElement('table')

  for (var i = 0; i < searchResults.length; i++) {
    var row = table.insertRow(-1)

    var cell = row.insertCell(-1)

    var report = searchResults[i]
    var category = report.category_id
    var image = 'report_images/' + report.report_id + '.jpg'
    var location = report.location_id
    
    var paramA="?reportID='"+ report.report_id +"'&status='Assigned'"

    var assignButton = "<button onclick=\"setStatus(" + report.report_id + ", 'Assigned')\" class='adminbuttons'>Assign</button>"
    var dismissButton = "<button onclick=\"setStatus(" + report.report_id + ", 'Dismiss')\" class='adminbuttons'>Dismiss</button>"
    var completedButton = "<button onclick=\"setStatus(" + report.report_id + ", 'Completed')\" class='adminbuttons'>Completed</button>"

    cell.innerHTML = createCard(report, image, category, location, assignButton + dismissButton + completedButton)
  }

  var tableContainer = document.getElementById('table')
  tableContainer.innerHTML = ''
  tableContainer.appendChild(table)
}

function createCard(report, image, category, location, buttons) {
  var buttonHtml = 
      "<div onclick=\"viewReports('" + report.report_id + "')\" class='repcard'>" +
      "<img class='cardImage' src='" + image + "'style='height:300;width:300'><div id=rptDet class=rptDet><div><strong>Category:</strong> " +
      category + '</div><div><strong>Details:</strong> ' +
      report.details + '</div><div><strong>Location:</strong> ' +
      location + '</div><div><strong>Reported On: </strong>' +
      report.insert_date + '</div><div><strong>Status: </strong>' +
      report.status + '</div>'

  if(buttons)
    buttonHtml += buttons;

  buttonHtml += '</div></div>';

  return buttonHtml
}