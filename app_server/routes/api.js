var express = require('express');
var router = express.Router();
const recorridosApi = require('../controllers/recorridosApi');

/* GET home page. */
router.get('/Recorridos', recorridosApi.getRecorridos);
module.exports = router;