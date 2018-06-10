const mongoose = require('mongoose');


const esquemaRecorridos = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  nombre_url: {
    type: String,
    required: true
  },
  tiempo: {
    type: Number,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },  
  tarifa: {
  	type: Number,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  apto: {
    type: String,
    required: true
  },
  puntos: {
  	type: [String],
  	required: true
  },
  descripcion_breve: {
    type: String,
    required: true
  },
  imagen: {
    type: String,
    required: true
  }

});

mongoose.model('recorridos', esquemaRecorridos,'recorridos');