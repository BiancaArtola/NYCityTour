var express = require('express');
var router = express.Router();
var ctrlAuth = require('../controllers/auth');
var passport = require('passport'); // Passport: Middleware de Node que facilita la autenticación de usuarios

/* Rutas de Passport */
// Ruta para desloguearse
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// Ruta para autenticarse con Facebook (enlace de login)
router.get('/facebook', passport.authenticate('facebook'));

// Ruta de callback, a la que redirigirá tras autenticarse con Facebook.
// En caso de fallo redirige a otra vista '/login'
router.get('/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/', failureRedirect: '/login' }
  
));



module.exports = router;
