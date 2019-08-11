var categories
var locations

//  getCategories() retrieves the current list of supported locations from the database
//  and uses this information to populate the 'categories' dropdown menu.
function getCategories () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status === 200) {
      categories = xmlReq.response
      populateDropdown(categories, 'category')
    }
  }

  xmlReq.open('GET', '/categories', true)
  xmlReq.responseType = 'json'
  xmlReq.send()
}

//  getLocations() retrieves the current list of supported locations from the database
//  and uses this information to populate the 'locations' dropdown menu.
function getLocations () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status === 200) {
      locations = xmlReq.response
      populateDropdown(locations, 'location')
    }
  }

  xmlReq.open('GET', '/locations', true)
  xmlReq.responseType = 'json'
  xmlReq.send()
}

// populateDropdown() uses the data provided to populate the specified dropdown menu.
// Arguments:  data: List, field: String
// The field value is used to select the appropriate dropdown element, and then each item
// found in 'data' is inserted into that element.
function populateDropdown (data, field) {
  var dropDown

  if (field === 'category') {
    dropDown = document.getElementById('categoryDropDown')
  } else if (field === 'location') {
    dropDown = document.getElementById('locationDropDown')
  }

  let option

  for (let i = 0; i < data.length; i++) {
    option = document.createElement('option')
    if (field === 'category') {
      option.text = data[i].category
      option.value = data[i].category_id
    } else if (field === 'location') {
      option.text = data[i].location
      option.value = data[i].location_id
    }
    dropDown.add(option)
  }
}

function onReCAPTCHASuccess () {
  var submitButton = document.getElementById('submit-button').disabled = false
  console.log(submitButton)

  console.log(grecaptcha.getResponse())
}
