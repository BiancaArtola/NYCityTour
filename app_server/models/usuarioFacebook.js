// Modelo Usuario para la base de datos

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Campos que vamos a guardar en la base de datos
var UserSchema = new Schema({
	name				: String, // Nombre del usuario
	//provider		: String, // Cuenta del usuario (Facebook)
	provider_id : {type: String, unique: true}, // ID que proporciona Facebook
	photo			 : String, // Avatar o foto del usuario
	createdAt	 : {type: Date, default: Date.now} // Fecha de creación
});

// Exportamos el modelo 'User' para usarlo en otras
// partes de la aplicación
module.exports = mongoose.model('usuarioFacebook', UserSchema);