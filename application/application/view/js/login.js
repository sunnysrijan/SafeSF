function login() {
  var username = document.getElementById("username").value
  var password = document.getElementById("psw").value
  var remember = document.getElementById("remember").checked

  if(username === "")
    alert("Please enter a username")
  else if(password === "")
    alert("Please enter a password")

  if(username === "" || password === "")
    return

  var xmlReq = new XMLHttpRequest();

  xmlReq.onload = function() {
    if (xmlReq.status == 200)
      window.location.href =  "/"
    else
      alert(xmlReq.response)
  }

  var params = '?username=' + username + '&password=' + password + '&remember=' + remember

  xmlReq.open('GET', '/requestLogin' + params, true)
  xmlReq.send(null)
}