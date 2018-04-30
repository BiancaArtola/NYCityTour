var express = require('express');
var router = express.Router();



const homepageController = function (req, res) { 
  res.render('index', { title: 'hijo de una gran puta' });
};
/* GET home page. */
router.get('/', homepageController);

module.exports = router;

const ctrlMain = require('../controllers/main');
router.get('/', ctrlMain.index);
