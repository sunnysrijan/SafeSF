/*
Alex Wolski
Course: CSc 648 Software Engineering Summer 2019 Team 2

Make a request for the navbar template html file
Once retreived, add teh navbar to the current page
*/

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