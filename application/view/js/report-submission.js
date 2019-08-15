/*
Evan Guan
Course: CSc 648 Software Engineering Summer 2019 Team 2

Validate the fields on the report submission page
If they are valid, send a request to create a new report
*/

const catSelection = document.getElementById('categoryDropDown')
const locSelection = document.getElementById('locationDropDown')
const detailsComment = document.getElementById('detailsEntry')
const imageFile = document.getElementById('image_ref')
const submitButton = document.getElementById('submit-button')
const form = document.getElementById('report-submission-form')

// ---------- THESE MUST BE CHANGED TO BE <= THE SIZE OF RELATED DB COLUMNS ----------
const numberOfCategories = 5
const numberOfLocations = 117
const maxDetailsVarcharAmount = 300
// ---------- /THESE MUST BE CHANGED TO BE <= THE SIZE OF RELATED DB COLUMNS ----------

// The variable used to track whether or not the marker is in the vicinity of San Francisco.
var boolMarkerInSF

// Click event on the submit button.
submitButton.addEventListener('click', function (event) {
  event.preventDefault();
  var canSubmit = true

  //Check if uesr is logged in and submit form
  if (!checkCookie()) {
    alert("You must be logged into post. Redirecting to login page.")
    window.location.href = "/login";
  } else {
    document.getElementById('report-submission-form').submit()
  }

  // Go in bottom-up order so we can show the top-most form error first.
  // One-way mechanism, if it gets set to false it stays that way,
  // while still allowing us to run all the tests.
  if(!isCaptchaValid() && true) {
    canSubmit = false
  }
  if(!isFileValid() && true) {
    canSubmit = false
  }
  if(!isCoordValid() && true) {
    canSubmit = false
  }
  if(!isDetailsValid() && true) {
    canSubmit = false
  }
  if(!isLocationIDValid() && true) {
    canSubmit = false
  }
  if(!isCategoryIDValid() && true) {
    canSubmit = false
  }

  // One final check.
  if (canSubmit) {
    form.submit()
  }
})

// Testing category_id
function isCategoryIDValid () {
  if (validator.isLength(catSelection.selectedIndex + '', { min: 1, max: 2 }) &&
      validator.isInt(catSelection.selectedIndex + '', { min: 1, max: parseInt(numberOfCategories) })) {
    // Be sure to empty the field of past errors if there were any.
    document.getElementById('categoryValidity').innerHTML = ''
    return true
  } else {
    // Display error and scroll to the field.
    document.getElementById('categoryValidity').innerHTML =
      'Please select a category.'
    document.getElementById('categoryLabel').scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
    return false
  }
}

// Testing category_id
function isLocationIDValid () {
  if (validator.isLength(locSelection.selectedIndex + '', {min:1, max: 4 }) &&
      validator.isInt(locSelection.selectedIndex + '', { min: 1, max: parseInt(numberOfLocations) })) {
    // Be sure to empty the field of past errors if there were any.
    document.getElementById('locationValidity').innerHTML = ''
    return true
  } else {
    // Display error and scroll to the field.
    document.getElementById('locationValidity').innerHTML =
      'Please select a location!'
    document.getElementById('locationLabel').scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
    return false
  }
}

// Testing details
function isDetailsValid () {
  if (validator.isLength(detailsComment.value + '', { min: 5, max: parseInt(maxDetailsVarcharAmount) })) {
    // Be sure to empty the field of past errors if there were any.
    document.getElementById('detailsValidity').innerHTML = ''
    return true
  } else {
    // Display error and scroll to the field.
    document.getElementById('detailsValidity').innerHTML =
      'Please enter some details about the hazard.'
    document.getElementById('detailsLabel').scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
    return false
  }
}

// Testing coordinates
function isCoordValid () {
  // Call the map counterpart to this js file and ask them if the marker is in a valid position.
  boolMarkerInSF = getIsMarkerInSF()

  var validMarkerLocationMessage = 'The marker is in a valid location, thank you!'
  var invalidMarkerLocationMessage = 'The marker is in an invalid location.<br>Please place it closer to San Francisco.'
  if (boolMarkerInSF) {
    // Be sure to notify the user that the coordinates are ok.
    document.getElementById('coordinatesValidity').innerHTML =
      '<p style=\'color: green\'>' + validMarkerLocationMessage + '</p>'
    return true
  } else {
    // Display error and scroll to the field.
    document.getElementById('coordinatesValidity').innerHTML =
      '<p style=\'color: red\'>' + invalidMarkerLocationMessage + '</p>'
    document.getElementById('mapsLabel').scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
    return false
  }
}

console.log(imageFile.files)

// Testing file
function isFileValid () {
  if(imageFile.files.length === 1) {
    var fileSize = imageFile.files[0].size / 1024 / 1024; // convert to MB
    if (fileSize > 5) { // filesize is more than 5MB
      // Display error and scroll to the field.
      document.getElementById('fileValidity').innerHTML =
        'Please upload 1 picture of the hazard.<br>Image must be less than 5MB in size.'
      document.getElementById('fileValidity').scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
      return false
    } else {
      // Be sure to empty the field of past errors if there were any.
      document.getElementById('fileValidity').innerHTML = ''
      return true
    }
  } else {
    // Display error and scroll to the field.
    document.getElementById('fileValidity').innerHTML =
      'Please upload 1 picture of the hazard.<br>Image must be less than 5MB in size.'
    document.getElementById('fileValidity').scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
    return false
  }
}

function isCaptchaValid()
{
  if (grecaptcha && grecaptcha.getResponse().length > 0) {
    // Captcha checked
    // Be sure to empty the field of past errors if there were any.
    document.getElementById('captchaValidity').innerHTML = ''
    return true
  } else {
    // Captcha not checked
    // Display error and scroll to the field.
    document.getElementById('captchaValidity').innerHTML =
      'Please check the box to continue.'
    document.getElementById('captchaValidity').scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
    return false
  }
}


function sendRegisterRequest() {
  var xmlReq = new XMLHttpRequest();

  xmlReq.onload = function() {
    if (xmlReq.status == 200)
      window.location.href =  "/"
    else
      alert(xmlReq.response)
  }

  var params = '?username=' + name.value + '&email=' + email.value + '&password=' + password.value + '&g-recaptcha-response=' + grecaptcha.getResponse()

  xmlReq.open('POST', '/requestRegister' + params, true)
  xmlReq.send(null)
}
