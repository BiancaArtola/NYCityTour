const mongoose = require('mongoose');
const dbURI='mongodb://user:user@ds014648.mlab.com:14648/recorridos';

mongoose.connect(dbURI);

require('./recorridos');
require('./estilos');
require('./User');