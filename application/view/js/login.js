const name = document.getElementById('username')
const password = document.getElementById('psw')
const form = document.getElementById('login-form')
const submitButton = document.getElementById('submit-button')

// Click event on the submit button.
submitButton.addEventListener('click', function (event) {
console.log('login clicked')

  var canSubmit = true

  // Do all of the tests so we can print error messages as needed.
  if(!isUsernameValid(name.value)) {
    canSubmit = false
  }

  if(!isPasswordValid(password.value)) {
    canSubmit = false
  }

  if (canSubmit) {
    form.submit()
  }
})

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

// function login() {
//   var username = document.getElementById("username").value
//   var password = document.getElementById("psw").value
//   var remember = document.getElementById("remember").checked
//
//   if(username === "")
//     alert("Please enter a username")
//   else if(password === "")
//     alert("Please enter a password")
//
//   if(username === "" || password === "")
//     return
//
//   var xmlReq = new XMLHttpRequest();
//
//   xmlReq.onload = function() {
//     if (xmlReq.status == 200)
//       window.location.href =  "/"
//     else
//       alert(xmlReq.response)
//   }
//
//   var params = '?username=' + username + '&password=' + password + '&remember=' + remember
//
//   xmlReq.open('GET', '/requestLogin' + params, true)
//   xmlReq.send(null)
// }
