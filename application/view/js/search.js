const urlParams = new URLSearchParams(window.location.search) // Parameter parser class.

function search () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) { createTable(xmlReq.response) }
  }

  xmlReq.open('GET', '/search?user_entry=' + urlParams.get('query'), true)
  xmlReq.responseType = 'json'
  xmlReq.send(null)
}
function admin () {
  console.log("In Admin Func")
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) 
    { console.log("Recvd response")
    console.log(xmlReq.response)
      createTableAdmin(xmlReq.response) 
    }
  }

  xmlReq.open('GET', '/search?admin=true', true)
  xmlReq.responseType = 'json'
  xmlReq.send(null)
}

function setStatus(param) {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) { alert(xmlReq.response) }
  }

  xmlReq.open('POST', '/admin'+param, true)
  xmlReq.responseType = 'json'
  xmlReq.send(null)
}

function admin () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) 
    { createTableAdmin(xmlReq.response) 
    }
  }

  xmlReq.open('GET', '/search?admin=true', true)
  xmlReq.responseType = 'json'
  xmlReq.send(null)
}

// function getSearchParams () {
//   var category_id = document.getElementById('categoryDropDown').value
//   var location_id = document.getElementById('locationDropDown').value

//   var user_entry = document.getElementById('searchBox').value

//   var requestParam = '?'
//   var firstParam = true

//   if (category_id != -1) {
//     requestParam += 'category_id=' + category_id
//     firstParam = false
//   }

//   if (location_id != -1) {
//     if (!firstParam) {
//       requestParam += '&'
//     }

//     requestParam += 'location_id=' + location_id
//     firstParam = false
//   }

//   if (user_entry != '') {
//     if (!firstParam) {
//       requestParam += '&'
//     }

//     requestParam += 'user_entry=' + user_entry
//   }

//   return requestParam
// }

function getValueOfId (jsonData, field, id) {
  for (var i = 0; i < jsonData.length; i++) {
    if (field === 'category_id' && jsonData[i].category_id === id) {
      return jsonData[i].category
    } else if (field === 'location_id' && jsonData[i].location_id === id) {
      return jsonData[i].location
    }
  }
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

    cell.innerHTML = "<div class='admincard'><div onclick=\"viewReports('" + report.report_id + "')\" class='repcard'>" +
      "<img class='cardImage' src='" + image + "'><div id=rptDet class=rptDet><div><strong>Category:</strong> " +
      category + '</div><div><strong>Details:</strong> ' +
      report.details + '</div><div><strong>Location:</strong> ' +
      location + '</div><div><strong>Reported On: </strong>' +
      report.insert_date + '</div><div><strong>Status: </strong>' +
      //NEED HELP HERE
      report.status + '</div></div></div><div class="buttonsdiv"><button onclick='+'setStatus("?reportID="'+report.report_id+'"&status="Assigned")'+"class='adminbuttons'>Assign</button><button value='?reportID="+ report.report_id +"&status=Dismissed' class='adminbuttons'>Dismiss</button><button value='?reportID="+ report.report_id +"&status=Completed' class='adminbuttons'>Completed</button></div></div>"

    // Check for lat/lng. If it doesn't exit, then we need the coordinates of the park instead.
    //var markerLat = report.loc_lat != null ? report.loc_lat : report.park_loc_lat
    //var markerLng = report.loc_long != null ? report.loc_long : report.park_loc_long
    // Add marker for map using this result.
    // addReportMarkerToMap(reportCategory, reportCategoryID, reportThumbnail, reportDetails, reportID, markerLat, markerLng)
    //addReportMarkerToMap(category, report.category_id, image, report.details, report.report_id, markerLat, markerLng)
  }

  var tableContainer = document.getElementById('table')
  tableContainer.innerHTML = ''
  tableContainer.appendChild(table)
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

    cell.innerHTML = "<div onclick=\"viewReports('" + report.report_id + "')\" class='repcard'>" +
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

// The original re-direct viewReport function.
// function viewReports (report_id) {
//   window.location.href = '/report?report_id=' + report_id
// }
