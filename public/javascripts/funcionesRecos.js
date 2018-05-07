var status;
var access_token;

$(function() {
  var al=localStorage.getItem("comentario"+document.title);
  //cargarComentarios();
  obtenerInformacionJSON();
  
});

function oyentePaginaRecorrido(){
	if(status==='connected')
	{
		$(function() {
  
        FB.api('/me', {fields:'name'}, function(response) {
          alert(response);
		});
		var texto= document.getElementById("paginaRecorrido").value;
	    localStorage.setItem("comentario"+document.title,texto);
	    cargarComentarios();
	}
     )}
	else
	{
		alert("Para poder ingresar comentarios debe estar logueado.");
	}
}
 
function statusChangeCallback(response){
	alert(response.status);
}

function obtenerInformacionJSON(){
  var xmlhttp = new XMLHttpRequest();
  var url="https://astreiten.github.io/CiudadesTuristicas/bootstrap/js/recorridos.json";
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        obtenerDatosRecorridos(myArr);

   	 }
}

	  xmlhttp.open("GET", url, true);
	  xmlhttp.send();
}

function obtenerDatosRecorridos(myArr){
	var numeroRecorrido=getNumeroRecorrido(document.title);

	//Obtengo nombre
	var nombre = myArr.recorridos[numeroRecorrido].nombre;
    var stringNombre= "<p><h1><strong>"+nombre+"</strong></h1>";
	document.getElementById("nombre_recorrido").innerHTML= stringNombre;

	//Obtengo tarifa
	var tarifa = myArr.recorridos[numeroRecorrido].tarifa;
	document.getElementById("tarifa_recorrido").innerHTML = document.getElementById("tarifa_recorrido").innerHTML +" U$ "+tarifa;

	//Obtengo categoria
	var categoria = myArr.recorridos[numeroRecorrido].categoria;
	document.getElementById("categoria_recorrido").innerHTML = document.getElementById("categoria_recorrido").innerHTML +" "+categoria;

	//Obtengo tiempo estimado
	var tiempo = myArr.recorridos[numeroRecorrido].tiempo;
	document.getElementById("tiempo_recorrido").innerHTML = document.getElementById("tiempo_recorrido").innerHTML +" "+tiempo+" horas";

	//Obtengo descripcion
	var descripcion = myArr.recorridos[numeroRecorrido].descripcion;
	document.getElementById("descripcion_recorrido").innerHTML = document.getElementById("descripcion_recorrido").innerHTML +" "+descripcion;

	//Obtengo los puntos
	for (var i =0 ; i < myArr.recorridos[numeroRecorrido].puntos.length; i++)
		obtenerPuntos(myArr, i);	
}

function obtenerPuntos(myArr, i){
	var numeroRecorrido=getNumeroRecorrido(document.title);
	//Punto 1
	var punto = myArr.recorridos[numeroRecorrido].puntos[i].nombre;
	document.getElementById("titulo_punto"+i).innerHTML = punto;
	

	var direccionPunto = myArr.recorridos[numeroRecorrido].puntos[i].direccion;
	document.getElementById("direccion_punto"+i).innerHTML = direccionPunto;
	

	var imagen = myArr.recorridos[numeroRecorrido].puntos[i].imagen;
	var lugarImagen = document.getElementById("imagen_punto"+i).setAttribute('src',imagen);

}

function borrarContenido(){
	document.getElementById("paginaRecorrido").innerHTML = "";
}

function cargarComentarios(){
	document.getElementById("exampleFormControlTextarea1").value=localStorage.getItem("comentario"+document.title);
}

function getNumeroRecorrido(numeroRecorrido){
	if (numeroRecorrido=="Museos Nueva York")
		return 0;
	else if (numeroRecorrido=="Recorrido juvenil")
		return 1;	
	else if (numeroRecorrido=="Recorrido para bicicletas")
		return 2;	
	else
		return 3;	
}

$(function() { 
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '863010233882857',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.0'
      });
      FB.AppEvents.logPageView();
      FB.getLoginStatus(function(response) {
         statusChangeCallback(response);
         alert("UID"+response.userID);
         status=response.status;
         access_token=response.access_token;
       });
	   FB.Event.subscribe('comment.create',
       function(response) {
          alert('A new comment has been added!');
       });

    }
});

function statusChangeCallback(response){
     if (response.status === 'connected') {
	     var uid = response.authResponse.userID;
	     var accessToken = response.authResponse.accessToken;
     } else if (response.status === 'not_authorized') {

     } else { 
     	alert("no logeado");
     	 console.log("hola");    
     }
}

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
  	return;
  }
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

