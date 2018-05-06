const mongoose = require('mongoose');

//const dbURI = 'mongodb://localhost:27017/Recorridos';
const dbURI='mongodb://user:user@ds014648.mlab.com:14648/recorridos'
mongoose.connect(dbURI);
//mongoose.connect(process.env.MONGODB_URI || dbURI);
require('./recorridos');