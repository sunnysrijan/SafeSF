function checkCookie () {
  var cookies = document.cookie.replace(/ /g,'').split(';')
  var cookiePresent = false

  for (var i = 0; i < cookies.length; i++) {
    if (cookies[i].startsWith('accessToken=')) {
        cookiePresent = true
      break
    }
  }
  
  return cookiePresent;
}

function requestAccess () {
  var xmlReq = new XMLHttpRequest()

  xmlReq.onload = function () {
    if (xmlReq.status == 200) {
      	if (xmlReq.response.authenticated) {
          console.log('authenticated')
          document.getElementById('welcomeText').innerText = 'Welcome ' + xmlReq.response.username + '!'
          document.getElementById('welcomeBox').style = 'display: block'
      		document.getElementById('loginBtn').style = 'display: none'
      		document.getElementById('registerBtn').style = 'display: none'
      		document.getElementById('logoutBtn').style = 'display: block'

          if(xmlReq.response.admin == '1')
            document.getElementById('adminBtn').style = 'display: block'
          else
            document.getElementById('adminBtn').style = 'display: none'
      } else {
        console.log('not authenticated')
        document.getElementById('welcomeBox').style = 'display: none'
        document.getElementById('adminBtn').style = 'display: none'
    		document.getElementById('loginBtn').style = 'display: block'
    		document.getElementById('registerBtn').style = 'display: block'
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
