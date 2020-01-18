/*
Alex Wolski
Course: CSc 648 Software Engineering Summer 2019 Team 2

Load categories and location from the database, and use the resutls to populate the respective dropdowns
*/

var categories
var locations
var parks

function getCategories () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) {
      categories = xmlReq.response
      populateDropdown(categories, 'category')
      console.log(document.getElementById("categoryDropDown").selectedIndex)
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
      console.log(document.getElementById("locationDropDown").selectedIndex)
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
