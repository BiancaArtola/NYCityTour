var map;
var markersArray = [];
var recorridos;
var user_id;
var lastOpenedInfoWindow;

$(function() { 
         $.get("./api/recorridos", function (Recorridos) 
          {
          recorridos=Recorridos;      
          });
           $.get("./api/estilos?user="+user_id,function (estilos) 
             {
         if(estilos[0]!=undefined){
            var estilo=estilos[0].style;
            loadStyle(estilo);
         }else        
            loadStyle(localStorage.getItem("estilo"));
         
            });
       });
      

function initMap() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById("campo"), { 
    center: {lat: 40.7825, lng: -73.966111},
    zoom: 12
   });
}


function encontrarChequeado(){
  clearOverlays(); //Remueve los marcadores que se encontraban en el mapa de un recorrido seleccionado. 

  //Obtiene seleccionados por el filtrado.
  var movilidad = document.getElementById('movilidad');
  var movilidad_valor = movilidad.value;

  var tarifa_minima = document.getElementById('tarifa_minima').value;
  var tarifa_maxima =  document.getElementById('tarifa_maxima').value;
  
  var categoria = document.getElementById('categoria');
  var categoria_valor= categoria.value;

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
      //Obtiene los recorridos que cumplen con cada condicion de filtrado.
        cumpleMovilidad=chequearMovilidad(myArr[j],movilidad_valor);
        cumpleTarifa=chequearTarifa(myArr[j],tarifa_minima, tarifa_maxima);
        cumpleCategoria=chequearCategoria(myArr[j],categoria_valor);
        cumpleDuracion=chequearDuracion(myArr[j],duracion_minima, duracion_maxima);
        //alert(myArr[j].nombre+" movi"+cumpleMovilidad);

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
      if (recorrido.apto == movilidad_valor.toLowerCase())
       return true;
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
    $(".card").hide();  //Se quitan de la pantalla aquellos recorridos que eran mostrados anteriormente.
    document.getElementById("textoFiltrado").innerHTML ="Recorridos encontrados segun el filtrado";
    var stringCumple =[];
    var cantCumple=0;
    for (var i=0;i<cumplen.length;i++){
        var recorridoEnMapa = cumplen[i];
        var stringHtml = "https://ciudadesturisticas.herokuapp.com/"+cumplen[i].nombre_url;

        //Crea un card con los datos correspondientes al recorrido que debe ser mostrado.
        stringCumple[cantCumple] = "<div class='card' style='width: 22rem;'><br><a href="+stringHtml+
          " target='_blank'><img class='card-img-top' src="+recorridoEnMapa.imagen+"><br><div class='card-body'><br> <h5 class='card-title'>"+
          recorridoEnMapa.nombre+"</h5></a><br><p align='justify' class='card-text'>"+recorridoEnMapa.descripcion_breve+
          "</p><br><a href='#' class='btn btn-secondary' onclick='cargarEnMapa(\""+recorridoEnMapa.nombre+"\");'>Cargar en mapa</a> </div></div>";

        cantCumple++;
    }
    var string = "";
    for (var x=0; x<cantCumple;x++){
      //Crea el string con todos los cards que deben ser mostrados segun el filtrado.
      string = string.concat(stringCumple[x]);
    }
     document.getElementById("seccionCards").innerHTML = string;
  }
}


function cargarEnMapa(nombre){  
  var reco = obtenerRecorrido(nombre);
  clearOverlays(); 

  var auxiliarMarker = 0; //a modificar a futuro.
  var auxiliarImagen = 0; //a modificar a futuro.

  for (var i=0;i<reco.puntos.length;i++) {

      var aux = reco.puntos[auxiliarImagen];
      auxiliarImagen++;
      var service = new google.maps.places.PlacesService(map);
     

      service.getDetails({ placeId: reco.puntos[i] }, function(place, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            var marker=new google.maps.Marker({
              position: place.geometry.location,
              map:map
            });

           var contentString = '<div><strong>' + place.name + '</strong><br>' +
                place.formatted_address + '<br>' +
                'Rating: ' + place.rating + 
                '<br>' + "<img width='200' src=" +  place.photos[0].getUrl({ 'maxWidth': 1000, 'maxHeight': 1000 }) + ">" +
                '</div>';

          marker.info = new google.maps.InfoWindow({
              content: contentString,
                maxWidth: 500
          });

          google.maps.event.addListener(marker, 'click', function() {
            this.info.open(map, this);
            closeLastOpenedInfoWindow();
            lastOpenedInfoWindow = this;
          });

          markersArray[auxiliarMarker]=marker;
          auxiliarMarker++;
     }
    });
  }

  //Redirige la pagina hacia el mapa
  var tiempo = tiempo || 1000;
  var id="#campo";
  $("html, body").animate({ scrollTop: $(id).offset().top }, tiempo);

}

function closeLastOpenedInfoWindow() {
  //Cierra el infoWindow que se encuentra abierto actualmente.
    if (lastOpenedInfoWindow)
        lastOpenedInfoWindow.info.close();
}

function obtenerRecorrido(nombreRecorrido){
  //Retorna el recorrido correspondiente al nombre: nombreRecorrido
  var arreglo = recorridos;
  for (var i=0; i<arreglo.length;i++){
    if (arreglo[i].nombre.localeCompare(nombreRecorrido) == 0)
      return arreglo[i];
  }
}

function clearOverlays() {
  //Elimina los markers que se encuentran actualmente en el mapa
  for (var i = 0; i < markersArray.length; i++ )
    markersArray[i].setMap(null);
  markersArray.length = 0;
}



function loadStyle(numeroEstilo){
  if (numeroEstilo == null) 
    numeroEstilo = 2;
  var style="/stylesheets/estilo"+numeroEstilo+".css";
  document.getElementById('esti').setAttribute('href',style);
}

function changeStyle(){
  var txt=document.getElementById("esti").getAttribute('href');
  if(txt=="/stylesheets/estilo1.css") {
    var data={ "user": user_id,"newstyle": 2 };
    document.getElementById('esti').setAttribute('href', '/stylesheets/estilo2.css');
    if(user_id!=undefined) {
      $.ajax({
      url: './api/estilos',
      type: 'POST',
      data: data,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      dataType: "json",
      success: function(data){},
      error: function(data) {}
     });
    }else
      localStorage.setItem("estilo",2); 
  }else{
    var data={ "user": user_id,"newstyle": 1 };
    document.getElementById('esti').setAttribute('href', '/stylesheets/estilo1.css');
    if(user_id!=undefined){
      $.ajax({
      url: './api/estilos',
      type: 'POST',
      data: data,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      dataType: "json",
      success: function(data){},
      error: function(data) {}
     });
    
    }
    else
      localStorage.setItem("estilo",1);    
  }  
}





