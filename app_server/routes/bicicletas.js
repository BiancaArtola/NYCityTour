var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
   res.render('bici', { title: 'Recorrido para bicicletas' });
});

module.exports = router;
