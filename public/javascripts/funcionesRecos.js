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
  $.get("/api/recorridos", function (Recorridos) {
      obtenerDatosRecorridos(Recorridos);      
   });
}

function obtenerDatosRecorridos(myArr){
	var reco=getNumeroRecorrido(myArr,document.title);

	//Obtengo nombre
	var nombre = reco.nombre;
    var stringNombre= "<p><h1><strong>"+nombre+"</strong></h1>";
    //document.getElementById("titulo").innerHTML= stringNombre;
	document.getElementById("nombre_recorrido").innerHTML= stringNombre;

	//Obtengo tarifa
	var tarifa = reco.tarifa;
	document.getElementById("tarifa_recorrido").innerHTML = document.getElementById("tarifa_recorrido").innerHTML +" U$ "+tarifa;

	//Obtengo categoria
	var categoria = reco.categoria;
	document.getElementById("categoria_recorrido").innerHTML = document.getElementById("categoria_recorrido").innerHTML +" "+categoria;

	//Obtengo tiempo estimado
	var tiempo = reco.tiempo;
	document.getElementById("tiempo_recorrido").innerHTML = document.getElementById("tiempo_recorrido").innerHTML +" "+tiempo+" horas";

	//Obtengo descripcion
	var descripcion = reco.descripcion;
	document.getElementById("descripcion_recorrido").innerHTML = document.getElementById("descripcion_recorrido").innerHTML +" "+descripcion;

	//Obtengo los puntos
	for (var i =0 ; i < reco.puntos.length; i++)
		obtenerPuntos(reco.puntos[i]);	
}

function obtenerPuntos(punto){
	let map = new google.maps.Map(document.createElement('div'));
	this.googlePlaces = new google.maps.places.PlacesService(map);
    this.googlePlaces.getDetails({
          placeId: punto
        },  function(place, status) { 

        	var puntoNombre = punto.nombre;
	
		document.getElementsByName("titulo_"+punto)[0].innerHTML = place.name;	

		var direccionPunto = punto.direccion;
		document.getElementsByName("direccion_"+punto)[0].innerHTML = place.formatted_address;
		

		var imagen = place.photos[0].getUrl({ 'maxWidth': 1000, 'maxHeight': 1000 });
		var lugarImagen = document.getElementsByName("imagen_"+punto)[0].setAttribute('src',imagen);

        });
	
	
}

function getNumeroRecorrido(myArr,nombreRecorrido){
	
	for(var i=0; i<myArr.length;i++)
	{	
	
		if (myArr[i].nombre_url===nombreRecorrido)
		{
			return myArr[i];
		}
	}	
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

