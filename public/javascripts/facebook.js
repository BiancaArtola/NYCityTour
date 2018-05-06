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
         alert(response.status);
         });
      }
      });

  
     export function getStatus(){
      FB.getLoginStatus(function(response) {
         return response;
         });
     }

     function statusChangeCallback(response){
     if (response.status === 'connected') {
     var uid = response.authResponse.userID;
     var accessToken = response.authResponse.accessToken;
     } else if (response.status === 'not_authorized') {
     } else { alert("no logeado"); console.log("hola");    
     }
     }

     (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));