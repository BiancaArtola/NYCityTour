const mongoose = require('mongoose');

const esquemaEstilos = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  id: {
  	type: Number,
  	required: true
  }
});

mongoose.model('estilos', esquemaEstilos,'estilos');