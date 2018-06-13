// Modelo Usuario para la base de datos

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Campos que vamos a guardar en la base de datos
var UserSchema = new Schema({
	facebookID: String,
	facebookEmail: String,
	facebookName: String
});

// Exportamos el modelo 'usuarioFacebook' para usarlo en otras
// partes de la aplicación
module.exports = mongoose.model('usuarioFacebook', UserSchema);