var mapa;
var markersArray = [];
var recorridos;

$(function() {
  //loadStyle(localStorage.getItem("estilo"));
  $.get("./api/recorridos", function (Recorridos) 
  {
      recorridos=Recorridos;      
   });
 });


function initMap() {
  // Create a map object and specify the DOM element for display.
  mapa = new google.maps.Map(document.getElementById("campo"), { 
    center: {lat: 40.7825, lng: -73.966111},
    zoom: 12
   });
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
//Si ninguno de los valores es vacio, chequea que ninguno de ellos sea negativo y que valorMinimo sea menor que valorMaximo
  if (valor_minimo != "" && valor_maximo != ""){
    if (valor_minimo < 0 || valor_minimo > valor_maximo || valor_maximo < 0 ){
      enviarAlertaError();
      return false;
    }
  }
  //Si el valor minimo es vacio, se controla que el valor maximo no sea negativo
  else if (valor_minimo == ""){
    if (valor_maximo < 0){
       enviarAlertaError();
       return false;
    }
  }
  //Si el valor maximo es vacio, se controla que el valor minimo no sea negativo
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
    var myArr=recorridos;
    var cumpleMovilidad=false;
    var cumpleTarifa=false;
    var cumpleCategoria=false;
    var cumpleDuracion=false;
    var cumplen=new Array();
    var cant=0;
        
    for (var j=0; j<myArr.length;j++){
        cumpleMovilidad=chequearMovilidad(myArr[j],movilidad_valor);
        cumpleTarifa=chequearTarifa(myArr[j],tarifa_minima, tarifa_maxima);
        cumpleCategoria=chequearCategoria(myArr[j],categoria_valor);
        cumpleDuracion=chequearDuracion(myArr[j],duracion_minima, duracion_maxima);

        if(cumpleTarifa && cumpleDuracion && cumpleCategoria && cumpleMovilidad){
            cumplen[cant]=myArr[j];
            cant++;
        }       
    }

    mostrarRecorridos(cumplen); 

}


function chequearMovilidad(recorrido,movilidad_valor){
  //En caso de que el usuario haya seleccionado la opcion "todos los medios" no se filtraran recorridos por movilidad
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

function chequearCategoria(recorrido,categoria_valor){
  //En caso de que el usuario haya seleccionado la opcion "todos los recorridos" no se filtraran recorridos por categoria
  if (categoria_valor.localeCompare("Todos los recorridos") == 0)
    return true;
  else
    return categoria_valor.toLowerCase() == recorrido.categoria;
}

function chequearDuracion(recorrido,duracion_minima, duracion_maxima){
  if (duracion_minima == "")
    duracion_minima = 0;
  if (duracion_maxima == "")
    duracion_maxima = 9999999999;
   return duracion_minima <= recorrido.tiempo && duracion_maxima >= recorrido.tiempo;
}

function chequearTarifa(recorrido, tarifa_minima, tarifa_maxima){ 
  if (tarifa_minima == ""){
    tarifa_minima = 0;
  }
  if (tarifa_maxima == "")
    tarifa_maxima = 9999999999;
  return tarifa_minima <= recorrido.tarifa && tarifa_maxima >= recorrido.tarifa;
}


function mostrarRecorridos(cumplen){
  if (cumplen.length == 0){
        alert("No se encontraron recorridos con esas caracteristicas. ");
  }
  else{
  	$(".card").hide();
  	document.getElementById("textoFiltrado").innerHTML ="Recorridos encontrados segun el filtrado";
    var stringCumple =[];
    var cantCumple=0;
	  for (var i=0;i<cumplen.length;i++){
        var recorridoCumple= cumplen[i].nombre;
        var recorridoEnMapa = cumplen[i];
        stringCumple[cantCumple] = "<div class='card' style='width: 22rem;'><br><img class='card-img-top' src="+recorridoEnMapa.puntos[0].imagen+"><br><div class='card-body'><br><h5 class='card-title'>"+recorridoCumple+"</h5><br><p class='card-text'>"+recorridoEnMapa.descripcion+"</p><br><a href='#' class='btn btn-secondary' onclick='cargarEnMapa()'>Cargar en mapa</a><br> </div><br></div>";
        alert(stringCumple[cantCumple]);
        cantCumple++;
    }
    var string = "";
    for (var x=0; x<cantCumple;x++){
      string = string.concat(stringCumple[x]);
    }

     document.getElementById("seccionCards").innerHTML = string;
  }
}

function obtenerRecorrido(nombreRecorrido){
  var arreglo = recorridos;
  var recorridoCorrecto= "";
  for (var i=0; i<arreglo.length;i++){
    if (arreglo[i].nombre.localeCompare(nombreRecorrido) == 0)
      return arreglo[i];
  }
}


function cargarEnMapa(nombre){
  alert("hola");
  var reco = obtenerRecorrido(nombre);
  clearOverlays();
  for (var i=0;i<reco.puntos.length;i++) {
	  var myLatlng = new google.maps.LatLng(reco.puntos[i].coordenadas[0],reco.puntos[i].coordenadas[1]);
	  var marker=new google.maps.Marker({
	          position: myLatlng,
	          map:mapa,
	          title: reco.puntos[i].nombre
        })
  	  markersArray[i]=marker;
  }
  var tiempo = tiempo || 1000;
  var id="#campo";
  $("html, body").animate({ scrollTop: $(id).offset().top }, tiempo);
}


function loadStyle(n){
  if (n == null) n = 2;
  var style="/stylesheets/estilo"+n+".css";
  document.getElementById('esti').setAttribute('href',style);
}

function changeStyle(){
  var txt=document.getElementById("esti").getAttribute('href');
  if(txt=="/stylesheets/estilo1.css")  {
    document.getElementById('esti').setAttribute('href', '/stylesheets/estilo2.css');
    localStorage.setItem("estilo",2);
  }
  else  {
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

