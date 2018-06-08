var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main');
const ctrlRecorridos = require('../controllers/recorridos');


/* GET home page. */
router.get('/', ctrlMain.index);
router.get('/recorridos/:id', ctrlRecorridos.reco);

module.exports = router;
