var mongoose = require('mongoose');
var User = mongoose.model('usuarioFacebook');

// Estrategia de autenticación con Facebook
var FacebookStrategy = require('passport-facebook').Strategy;
// Fichero de configuración donde se encuentran las API keys
// Este archivo no debe subirse a GitHub ya que contiene datos
// que pueden comprometer la seguridad de la aplicación.
var config = require('./config');

// Exportamos como módulo las funciones de passport, de manera que
// podamos utilizarlas en otras partes de la aplicación.
// De esta manera, mantenemos el código separado en varios archivos
// logrando que sea más manejable.
module.exports = function(passport) {

	// Serializa al usuario para almacenarlo en la sesión
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	// Deserializa el objeto usuario almacenado en la sesión para
	// poder utilizarlo
	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});


	// Configuración del autenticado con Facebook
	passport.use(new FacebookStrategy({
		clientID			: '863010233882857',
		clientSecret	: 'dd7552c54381d2729ef9c03d46633628',
		callbackURL	 : 'https://ciudadesturisticas.herokuapp.com/auth/facebook/callback',
		profileFields : ['id', 'displayName', /*'provider',*/ 'emails']
	}, function(accessToken, refreshToken, profile, done) {
    	process.nextTick(function(){
    		User.findOne({'facebookID': profile.id}, function(err, user){
    			if(err)
    				return done(err);
    			if(user)
    				return done(null, user);
    			else {
    				newUser = new User({
                        facebookID: profile.id,
                        facebookEmail: profile.emails[0].value,
                        facebookName: profile.displayName
                    });

                    newUser.save(function(err, newUser) {
                        if(err) return done(err);
                        done(null, newUser);
                    });
    			}
    		});
    	});
    }));


};