var express = require('express');
var router = express.Router();
const recorridosApi = require('../controllers/recorridosApi');

/* GET home page. */
router.get('/recorridos', recorridosApi.getRecorridos);
router.get('/estilos',  recorridosApi.getEstilos);
router.post('/estilos', recorridosApi.setEstilo);
module.exports = router;