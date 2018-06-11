var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main');
const ctrlRecorridos = require('../controllers/recorridos');

var passport = require('passport');

/* GET home page. */
router.get('/', ctrlMain.index);
router.get('/recorridos/:id', ctrlRecorridos.reco);

router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


module.exports = router;
