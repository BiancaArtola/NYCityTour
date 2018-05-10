var status;
var user_id;

$(function() {
  var al=localStorage.getItem("comentario"+document.title);
  obtenerInformacionJSON();
  
});

function oyentePaginaRecorrido(){
	if(status==='connected'){
		$(function() {  
	        FB.api('/me', {fields:'name'}, function(response) {
	          alert(response);
		});
		var texto= document.getElementById("paginaRecorrido").value;
	    localStorage.setItem("comentario"+document.title,texto);
	    cargarComentarios();
		})}
	else
		alert("Para poder ingresar comentarios debe estar logueado.");
}
 
function statusChangeCallback(response){
	alert(response.status);
}

function obtenerInformacionJSON(){
  $.get("./api/recorridos", function (Recorridos) {
      obtenerDatosRecorridos(Recorridos);      
   });
}

function obtenerDatosRecorridos(myArr){
	var numeroRecorrido=getNumeroRecorrido(document.title);

	//Obtengo nombre
	var nombre = myArr[numeroRecorrido].nombre;
    var stringNombre= "<p><h1><strong>"+nombre+"</strong></h1>";
	document.getElementById("nombre_recorrido").innerHTML= stringNombre;

	//Obtengo tarifa
	var tarifa = myArr[numeroRecorrido].tarifa;
	document.getElementById("tarifa_recorrido").innerHTML = document.getElementById("tarifa_recorrido").innerHTML +" U$ "+tarifa;

	//Obtengo categoria
	var categoria = myArr[numeroRecorrido].categoria;
	document.getElementById("categoria_recorrido").innerHTML = document.getElementById("categoria_recorrido").innerHTML +" "+categoria;

	//Obtengo tiempo estimado
	var tiempo = myArr[numeroRecorrido].tiempo;
	document.getElementById("tiempo_recorrido").innerHTML = document.getElementById("tiempo_recorrido").innerHTML +" "+tiempo+" horas";

	//Obtengo descripcion
	var descripcion = myArr[numeroRecorrido].descripcion;
	document.getElementById("descripcion_recorrido").innerHTML = document.getElementById("descripcion_recorrido").innerHTML +" "+descripcion;

	//Obtengo los puntos
	for (var i =0 ; i < myArr[numeroRecorrido].puntos.length; i++)
		obtenerPuntos(myArr, i);	
}

function obtenerPuntos(myArr, i){
	var numeroRecorrido=getNumeroRecorrido(document.title);

	var punto = myArr[numeroRecorrido].puntos[i].nombre;
	document.getElementById("titulo_punto"+i).innerHTML = punto;	

	var direccionPunto = myArr[numeroRecorrido].puntos[i].direccion;
	document.getElementById("direccion_punto"+i).innerHTML = direccionPunto;
	

	var imagen = myArr[numeroRecorrido].puntos[i].imagen;
	var lugarImagen = document.getElementById("imagen_punto"+i).setAttribute('src',imagen);
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
         status=response.status;
         user_id=response.authResponse.userID;
         alert("user_id "+access_token);
       });
	   FB.Event.subscribe('comment.create',
       function(response) {
         
       });

    }
});

function statusChangeCallback(response){
    if (response.status === 'connected') {
	    var uid = response.authResponse.userID;
	    var accessToken = response.authResponse.accessToken;
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

