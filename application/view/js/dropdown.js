var categories
var locations
var parks

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

function getParks () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) {
      parks = xmlReq.response
      populateDropdown(parks, 'park')
    }
  }

  xmlReq.open('GET', '/parks', true)
  xmlReq.responseType = 'json'
  xmlReq.send()
}

function populateDropdown (data, field) {
  var dropDown

  if (field === 'category') {
    dropDown = document.getElementById('categoryDropDown')
  } else if (field === 'location') {
    dropDown = document.getElementById('locationDropDown')
  } else if (field === 'park') {
    dropDown = document.getElementById('parkDropDown')
  }

  if(dropDown != null)
  {
    let option

    for (let i = 0; i < data.length; i++) {
      option = document.createElement('option')

      if (field === 'category') {
        option.text = data[i].category
        option.value = data[i].category_id
      } else if (field === 'location') {
        option.text = data[i].location
        option.value = data[i].location_id
      } else if (field === 'park') {
        option.text = data[i].park
        option.value = data[i].park_id
      }

      dropDown.add(option)
    }
  }
}