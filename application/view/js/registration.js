
  function register() {
    var username = document.getElementById("username").value
    var email = document.getElementById("email").value
    var password = document.getElementById("psw").value
    var passwordRepeat = document.getElementById("psw-repeat").value
    var agree = document.getElementById("invalidCheck").value

    if(username === "")
      alert("Please enter a username")
    else if(email === "")
      alert("Please enter an email")
    else if(password === "")
      alert("Please enter a password")
    else if(passwordRepeat === "")
      alert("Please repeat your password")
    else if(password != passwordRepeat)
      alert("The passwords do not match. Please re-enter your password")
    else if(agree === "")
      alert("You must agree the term")

    if(username === "" || email === "" || password === "" || passwordRepeat === "" || password != passwordRepeat || agree === "" )
      return

    var xmlReq = new XMLHttpRequest();

    xmlReq.onload = function() {
      if (xmlReq.status == 200)
        window.location.href =  "/"
      else
        alert(xmlReq.response)
    }

    var params = '?username=' + username + '&email=' + email + '&password=' + password

    xmlReq.open('POST', '/requestRegister' + params, true)
    xmlReq.send(null)
  }
