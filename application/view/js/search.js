var categories
var locations

function getCategories () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) {
      categories = xmlReq.response
      populateDropdown(categories, 'category')
    }
  }

  xmlReq.open('GET', '/categories', true)
  xmlReq.responseType = 'json'
  xmlReq.send()
}

function getLocations () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) {
      locations = xmlReq.response
      populateDropdown(locations, 'location')
    }
  }

  xmlReq.open('GET', '/locations', true)
  xmlReq.responseType = 'json'
  xmlReq.send()
}

function populateDropdown (data, field) {
  var dropDown

  if (field === 'category')
    dropDown = document.getElementById('categoryDropDown')
  else if (field === 'location')
    dropDown = document.getElementById('locationDropDown')

  let option

  for (let i = 0; i < data.length; i++) {
    option = document.createElement('option')

    if (field === 'category') {
      option.text = data[i].category
      option.value = data[i].category_id
    }
    else if (field === 'location') {
      option.text = data[i].location
      option.value = data[i].location_id
    }

    dropDown.add(option)
  }
}

function search () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) { createTable(xmlReq.response) }
  }

  xmlReq.open('GET', '/search' + getSearchParams(), true)
  xmlReq.responseType = 'json'
  xmlReq.send(null)
}

function getSearchParams () {
  var category_id = document.getElementById('categoryDropDown').value
  var location_id = document.getElementById('locationDropDown').value

  var user_entry = document.getElementById('searchBox').value

  var requestParam = '?'
  var firstParam = true

  if (category_id != -1) {
    requestParam += 'category_id=' + category_id
    firstParam = false
  }

  if (location_id != -1) {
    if (!firstParam)
      requestParam += '&'

    requestParam += 'location_id=' + location_id
    firstParam = false
  }

  if (user_entry != '') {
    if (!firstParam)
      requestParam += '&'

    requestParam += 'user_entry=' + user_entry
  }

  return requestParam
}

function getValueOfId (jsonData, field, id) {
  for (var i = 0; i < jsonData.length; i++) {
    if (field === 'category_id' && jsonData[i].category_id === id)
      return jsonData[i].category
    else if (field === 'location_id' && jsonData[i].location_id === id)
      return jsonData[i].location
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

    cell.innerHTML = "<div onclick=\"viewReports('" + report.report_id + "')\" class='card'>" +
      "<img class='cardImage' src='" + image + "'style='height:300;width:300'><div id=rptDet class=rptDet><div><strong>Category:</strong> " +
      category + '</div><div><strong>Details:</strong> ' +
      report.details + '</div><div><strong>Location:</strong> ' +
      location + '</div><div><strong>Reported On: </strong>' +
      report.insert_date + '</div><div><strong>Status: </strong>' +
      report.status + '</div></div></div>'

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

function viewReports (report_id) {
  window.location.href = '/report?report_id=' + report_id
}
