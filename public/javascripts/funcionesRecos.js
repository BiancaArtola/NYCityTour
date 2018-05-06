var apif;
import {getStatus} from "facebook";
$(function() {

  var al=localStorage.getItem("comentario"+document.title);
  document.getElementById("paginaRecorrido").value=al;
  cargarComentarios();
  obtenerInformacionJSON();
  alert(getStatus());
  
  

});

function oyentePaginaRecorrido(){
	var texto= document.getElementById("paginaRecorrido").value;
	localStorage.setItem("comentario"+document.title,texto);
	cargarComentarios();
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
	var numeroRecorrido=getN(document.title);
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
	var numeroRecorrido=getN(document.title);
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

function getN(titulo)
{
	if (titulo=="Museos Nueva York")
	{
		return 0;
	}
	else
	{
		if (titulo=="Recorrido juvenil")
			{
				return 1;
			}
		else
		{
			if (titulo=="Recorrido para bicicletas")
			{
				return 2;
			}
			else
			{
				return 3;
			}
		}
	}
}