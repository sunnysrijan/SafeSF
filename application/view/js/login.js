/*
Evan Guan
Course: CSc 648 Software Engineering Summer 2019 Team 2

Validate the fields on the report submission page
If they are valid, send a request to create a new report
*/

const name = document.getElementById('username')
const password = document.getElementById('psw')
const submitButton = document.getElementById('submit-button')

// Click event on the submit button.
function login() {
  var canSubmit = true

  // Do all of the tests so we can print error messages as needed.
  if(!isUsernameValid(name.value)) {
    canSubmit = false
  }

  if(!isPasswordValid(password.value)) {
    canSubmit = false
  }

  if (canSubmit) {
    sendLoginRequest()
  }
}

// Testing username
function isUsernameValid (newUsername) {
  if (!validator.isEmpty(newUsername, { ignore_whitespace: true }) &&
      validator.isAlphanumeric(newUsername + '', ['en-US'] ) &&
      validator.isLength(newUsername + '', { min: 4, max: 100 })) {
      document.getElementById('usernameValidity').innerHTML = ''
    return true
  } else {
    document.getElementById('usernameValidity').innerHTML =
      'Username must be between 4 and 100 alpha-numeric characters long.'
    return false
  }
}

// Testing repeat password
function isPasswordValid (newPassword) {
  if (!validator.isEmpty(newPassword, { ignore_whitespace: true }) &&
      validator.isLength(newPassword + '', { min: 7, max: 100 })) {
    document.getElementById('passwordValidity').innerHTML = ''
    return true
  } else {
    document.getElementById('passwordValidity').innerHTML =
      'Password must be between 7 and 100 characters long.'
    return false
  }
}

function sendLoginRequest() {
  var remember = document.getElementById("remember").checked

  var xmlReq = new XMLHttpRequest();

  xmlReq.onload = function() {
    if (xmlReq.status == 200)
      window.location.href =  "/"
    else
      alert(xmlReq.response)
  }

  var params = '?username=' + name.value + '&password=' + password.value + '&remember=' + remember

  xmlReq.open('GET', '/requestLogin' + params, true)
  xmlReq.send(null)
}
