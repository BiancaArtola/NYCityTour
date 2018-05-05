const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/Recorridos';
mongoose.connect(dbURI);

require('./app_server/models/Recorridos');