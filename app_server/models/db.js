const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/Recorridos';
//mongoose.connect(dbURI);
mongoose.connect(process.env.MONGOLAB_URI || dbURI);
require('./recorridos');