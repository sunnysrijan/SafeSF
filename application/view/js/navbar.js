function loadNavbar () {
  var xmlReq= new XMLHttpRequest();

  xmlReq.onreadystatechange= function() {
    if (this.readyState!==4)
      return

  	//Load the navbar
    document.getElementById('navbar-placeholder').innerHTML= this.responseText;
    //Check if the user is logged in or not
    requestAccess();
  }
  
  xmlReq.open('GET', 'navbar-template.html', true);
  xmlReq.send();
}