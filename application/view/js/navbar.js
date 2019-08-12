function loadNavbar () {
  var xmlReq= new XMLHttpRequest();

  xmlReq.onreadystatechange= function() {
    if (this.readyState!==4)
      return

    document.getElementById('navbar-placeholder').innerHTML= this.responseText;
  }
  
  xmlReq.open('GET', 'navbar-template.html', true);
  xmlReq.send();
}