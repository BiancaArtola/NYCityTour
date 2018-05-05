const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/recorridos';
mongoose.connect(dbURI);

require('./recorridos');