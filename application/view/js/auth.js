function checkCookie () {
  var cookies = document.cookie.split(';')
  var cookiePresent = false

  for (var i = 0; i < cookies.length; i++) {
    if (cookies[i].startsWith('accessToken=')) {
    		cookiePresent = true
      break
    }
  }

  if (cookiePresent) {
	    document.getElementById('loginBtn').style.visibility = 'hidden'
    document.getElementById('registerBtn').style.visibility = 'hidden'
    document.getElementById('welcomeBox').innerText = 'Welcome!'
    document.getElementById('welcomeBox').style = 'display: block'
    document.getElementById('logoutBtn').style = 'display: block'
  } else {
    document.getElementById('loginBtn').style.visibility = 'visible'
    document.getElementById('registerBtn').style.visibility = 'visible'
    document.getElementById('welcomeBox').style = 'display: none'
    document.getElementById('logoutBtn').style = 'display: none'
  }
}

function requestAccess () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) {
        	if (xmlReq.response.authenticated) {
        		document.getElementById('loginBtn').style.visibility = 'hidden'
        		document.getElementById('registerBtn').style.visibility = 'hidden'
        		document.getElementById('welcomeBox').innerText = 'Welcome ' + xmlReq.response.username + '!'
        		document.getElementById('welcomeBox').style = 'display: block'
        		document.getElementById('logoutBtn').style = 'display: block'
      } else {
        		document.getElementById('loginBtn').style.visibility = 'visible'
        		document.getElementById('registerBtn').style.visibility = 'visible'
        		document.getElementById('welcomeBox').style = 'display: none'
        		document.getElementById('logoutBtn').style = 'display: none'

        		if (xmlReq.response.errMessage) { alert(xmlReq.response.errMessage) }
      }
    }
  }

  xmlReq.open('GET', '/requestAccess', true)
  xmlReq.responseType = 'json'
  xmlReq.send(null)
}

function logout () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) { window.location.href = '/' }
  }

  xmlReq.open('GET', '/requestLogout', true)
  xmlReq.send(null)
}
