var map;
var markersArray = [];
var recorridos;
var user_id="10209281704397898";

$(function() {
  alert("NUEVA EJECUCION");
  $.get("./api/recorridos", function (Recorridos) 
  {
      recorridos=Recorridos;      
   });

  $.post("./api/estilos?"+$.param({ user: user_id,newstyle: 5 }), function (response) 
         {
            alert("HICE EL POST");
         });

  $.get("./api/estilos",{"user":user_id}, function (estilos) 
  {
         if(estilos[0]!=undefined)
         {
            alert("estilo 0 es "+estilos[0].style);
            var estilo=estilos[0].style;
            loadStyle(estilo);
            alert("entre al if y cambie");
         } 
         else
         {
            alert("entre al else");
            loadStyle(localStorage.getItem("estilo"));
         } 
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
  	$(".card").hide();  //Se quitan de la pantalla aquellos recorridos que eran mostrados anteriormente.
  	document.getElementById("textoFiltrado").innerHTML ="Recorridos encontrados segun el filtrado";
    var stringCumple =[];
    var cantCumple=0;
	  for (var i=0;i<cumplen.length;i++){
        var recorridoEnMapa = cumplen[i];
        var stringHtml = "https://ciudadesturisticas.herokuapp.com/"+cumplen[i].nombre_url;

        //Crea un card con los datos correspondientes al recorrido que debe ser mostrado.
        stringCumple[cantCumple] = "<div class='card' style='width: 22rem;'><br><a href="+stringHtml+" target='_blank'><img class='card-img-top' src="+recorridoEnMapa.puntos[0].imagen+"><br><div class='card-body'><br> <h5 class='card-title'>"+recorridoEnMapa.nombre+"</h5></a><br><p align='justify' class='card-text'>"+recorridoEnMapa.descripcion+"</p><br><a href='#' class='btn btn-secondary' onclick='cargarEnMapa(\""+recorridoEnMapa.nombre+"\");'>Cargar en mapa</a><br> </div><br></div>";

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


  var contentString = 'hola';
  
  for (var i=0;i<reco.puntos.length;i++) {
    var myLatlng = new google.maps.LatLng(reco.puntos[i].coordenadas[0],reco.puntos[i].coordenadas[1]);
    var marker=new google.maps.Marker({
      position: myLatlng,
      map:map,
      title: reco.puntos[i].nombre
    });
    marker.info = new google.maps.InfoWindow({
        content: '<b>Speed:</b> ' + i + ' knots'
    });

    google.maps.event.addListener(marker, 'click', function() {
      this.info.open(map, this);
    });

    markersArray[i]=marker;
    //Redirige la pagina hacia el mapa
    var tiempo = tiempo || 1000;
    var id="#campo";
    $("html, body").animate({ scrollTop: $(id).offset().top }, tiempo);
  }
}
/*
function cargarEnMapa(nombre){
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

  //Redirige la pagina hacia el mapa
  var tiempo = tiempo || 1000;
  var id="#campo";
  $("html, body").animate({ scrollTop: $(id).offset().top }, tiempo);
}
*/
function obtenerRecorrido(nombreRecorrido){
  //Retorna el recorrido correspondiente al nombre: nombreRecorrido
  var arreglo = recorridos;
  for (var i=0; i<arreglo.length;i++){
    if (arreglo[i].nombre.localeCompare(nombreRecorrido) == 0)
      return arreglo[i];
  }
}

function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
}



function loadStyle(numeroEstilo){
  if (numeroEstilo == null) 
    numeroEstilo = 2;
  var style="/stylesheets/estilo"+numeroEstilo+".css";
  document.getElementById('esti').setAttribute('href',style);
}

function changeStyle(){
  alert("entre al oyente "+user_id);
  var txt=document.getElementById("esti").getAttribute('href');
  if(txt=="/stylesheets/estilo1.css")  
  {
    document.getElementById('esti').setAttribute('href', '/stylesheets/estilo2.css');
    if(user_id!=undefined)
    {
      alert("entre al if de uid");
      $.post("./api/estilos?"+$.param({ user: user_id,newstyle:2 }), function (response) 
         {
            alert(response.length);
         });
    }
    else
    {
      localStorage.setItem("estilo",2);
      alert("guarde en local");
    }   
  }
  else
  {
    document.getElementById('esti').setAttribute('href', '/stylesheets/estilo1.css');
    if(user_id!=undefined)
    {
      alert("entre al if de uid");
      $.post("./api/estilos?"+$.param({ user: user_id,newstyle: 1 }), function (response) 
         {
            alert(response.length);
         });
    }
    else
    {
       localStorage.setItem("estilo",1);
       alert("guarde en local");
    } 
  }
  
}

/*
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

*/

