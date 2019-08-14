function loadNavbar () {
  var path = window.location.pathname;
  var folder = path.substring(0, path.lastIndexOf('/'));
  var templatePath = ''

  if(folder == '/about')
    templatePath = '../'

  var xmlReq= new XMLHttpRequest();

  xmlReq.onreadystatechange= function() {
    if (this.readyState!==4)
      return

  	//Load the navbar
    document.getElementById('navbar-placeholder').innerHTML= this.responseText;
    //Check if the user is logged in or not
    requestAccess();
  }
  
  xmlReq.open('GET', templatePath + 'navbar-template.html', true);
  xmlReq.send();
}