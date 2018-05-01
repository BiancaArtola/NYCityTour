var mapa;
var markersArray = [];

$(function() {
  loadStyle(localStorage.getItem("estilo"));
});


function initMap() {
  // Create a map object and specify the DOM element for display.
  mapa = new google.maps.Map(document.getElementById("campo"), { 
    center: {lat: 40.7825, lng: -73.966111},
    zoom: 12
   });
}

function redireccionar()
{
  window.location.href="https://astreiten.github.io/CiudadesTuristicas/bootstrap/index.html";
}

function encontrarChequeado(){
  //Encontrar chequeado movilidad
  var movilidad = document.getElementById('movilidad');
  var movilidad_valor = movilidad.value;


  //Encontrar chequeado tarifa
  var tarifa_minima = document.getElementById('tarifa_minima').value;
  var tarifa_maxima =  document.getElementById('tarifa_maxima').value;
  

  //Encontrar chequeado categoria
  var categoria = document.getElementById('categoria');
  var categoria_valor= categoria.value;

  //Encontrar chequeado categoria
  var duracion_minima = document.getElementById('duracion_minima').value;
  var duracion_maxima = document.getElementById('duracion_maxima').value;

  if (chequearValores(tarifa_minima, tarifa_maxima) && chequearValores(duracion_minima, duracion_maxima))
    filtrarRecorridos(movilidad_valor, tarifa_minima, tarifa_maxima, categoria_valor, duracion_minima, duracion_maxima);
}

function chequearValores(valor_minimo, valor_maximo){
  if (valor_minimo != "" && valor_maximo != ""){
    if (valor_minimo < 0 || valor_minimo > valor_maximo || valor_maximo < 0 ){
      enviarAlertaError();
      return false;
    }
  }
  else if (valor_minimo == ""){
    if (valor_maximo < 0){
       enviarAlertaError();
       return false;
    }
  }
  else if (valor_maximo == ""){
    if (valor_minimo < 0){
      enviarAlertaError();
      return false;
    }
  }
  return true;
}

function enviarAlertaError(){  
    alert("Los valores ingresados sin invalidos. Por favor ingrese nuevamente. ");
}



 function filtrarRecorridos(movilidad_valor, tarifa_minima, tarifa_maxima, categoria_valor, duracion_minima, duracion_maxima){
  var xmlhttp = new XMLHttpRequest();
  var url="https://astreiten.github.io/CiudadesTuristicas/bootstrap/js/recorridos.json";
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        
        var cumpleMovilidad=false;
        var cumpleTarifa=false;
        var cumpleCategoria=false;
        var cumpleDuracion=false;
        var cumplen=new Array();
        var cant=0;
        
        for (var j=0; j<myArr.recorridos.length;j++)
        {
          cumpleMovilidad=chequearMovilidad(myArr.recorridos[j],movilidad_valor);
          cumpleTarifa=chequearTarifa(myArr.recorridos[j],tarifa_minima, tarifa_maxima);
          cumpleCategoria=chequearCategoria(myArr.recorridos[j],categoria_valor);
          cumpleDuracion=chequearDuracion(myArr.recorridos[j],duracion_minima, duracion_maxima);

          alert(cumpleMovilidad+" "+cumpleTarifa+" "+cumpleCategoria+" "+cumpleDuracion);
          if(cumpleTarifa && cumpleDuracion && cumpleCategoria && cumpleMovilidad)
          {
            cumplen[cant]=myArr.recorridos[j];
            cant++;
          }       
        }

        mostrarRecorridos(cumplen);
        
    }
    else{
         document.getElementById("campo").firstChild.data = "Status: " + this.status + "State " + this.readyState;
    }
}
  xmlhttp.open("GET", url, true);
  xmlhttp.send();

}



function chequearMovilidad(recorrido,movilidad_valor)
{
  if (movilidad_valor.localeCompare("Todos los medios") == 0)
    return true;
  else{
    for (var i=0; i<recorrido.apto.length ; i ++){
      if (recorrido.apto[i] == movilidad_valor.toLowerCase()){
       return true;
      }
    }
    return false;
  }
}

function chequearCategoria(recorrido,categoria_valor)
{
  if (categoria_valor.localeCompare("Todos los recorridos") == 0)
    return true;
  else
    return categoria_valor.toLowerCase() == recorrido.categoria;
}

function chequearDuracion(recorrido,duracion_minima, duracion_maxima)
{
  if (duracion_minima == "")
    duracion_minima = 0;
  if (duracion_maxima == "")
    duracion_maxima = 9999999999;
   return duracion_minima <= recorrido.tiempo && duracion_maxima >= recorrido.tiempo;
}

function chequearTarifa(recorrido, tarifa_minima, tarifa_maxima)
{ 
  if (tarifa_minima == ""){
    tarifa_minima = 0;
  }
  if (tarifa_maxima == "")
    tarifa_maxima = 9999999999;
  return tarifa_minima <= recorrido.tarifa && tarifa_maxima >= recorrido.tarifa;
}


function mostrarRecorridos(cumplen)
{
  if (cumplen.length == 0){
        alert("No se encontraron recorridos con esas caracteristicas. ");
  }
  else{

      document.getElementById("mostrador").innerHTML= " <h7>Recorridos encontrados segun el filtrado: </h7>";
      for (var i=0;i<cumplen.length;i++)
      {
        var str= cumplen[i].nombre;
        var recorridoEnMapa=cumplen[i];
        var result;
        if (str=="Recorrido para bicicletas")
        {
          result=str.link("https://astreiten.github.io/CiudadesTuristicas/bootstrap/bicicletas.html");
        }
        else
        {
          if(str=="Recorrido juvenil")
          {
            result=str.link("https://astreiten.github.io/CiudadesTuristicas/bootstrap/juvenil.html");
          }
          else
          {
            if(str=="Recorrido Midtown-Manhattan")
            {
              result=str.link("https://astreiten.github.io/CiudadesTuristicas/bootstrap/mid.html");
            }
            else
            {
              result=str.link("https://astreiten.github.io/CiudadesTuristicas/bootstrap/museos.html");
            }
          }
        }

        var botonVerMapa= '<button id="botonReco" class="btn btn-outline-primary" type="button">Ver recorrido en mapa</button>';

        document.getElementById("mostrador_izquierda").innerHTML="<li><h8>"+result+"</h8></li> <br>";
        document.getElementById("mostrador_derecha").innerHTML= botonVerMapa;
        document.getElementById("botonReco").addEventListener("click", function(){
        cargarEnMapa(recorridoEnMapa);
    });
  }
}
}

function cargarEnMapa(reco)
{
  clearOverlays();
  for (var i=0;i<reco.puntos.length;i++)
  {
  var myLatlng = new google.maps.LatLng(reco.puntos[i].coordenadas[0],reco.puntos[i].coordenadas[1]);
  var marker=new google.maps.Marker({
          position: myLatlng,
          map:mapa,
          title: reco.puntos[i].nombre
        })
  markersArray[i]=marker;
  }
}

/* ESTILOS */

function loadStyle(n)
{
  if (n == null) n = 2;
  var style="/stylesheets/estilo"+n+".css";
  document.getElementById('esti').setAttribute('href',style);
}

function changeStyle()
{
  var txt=document.getElementById("esti").getAttribute('href');
  if(txt=="/stylesheets/estilo1.css")
  {
    document.getElementById('esti').setAttribute('href', '/stylesheets/estilo2.css');
    localStorage.setItem("estilo",2);
  }
  else
  {
    document.getElementById('esti').setAttribute('href', '/stylesheets/estilo1.css');
    localStorage.setItem("estilo",1);
  }
  
}

function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
}

