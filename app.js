var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport'); // Passport: Middleware de Node que facilita la autenticación de usuarios
var app = express(); 
var Session = require('express-session');

// Importamos el modelo usuario y la configuración de passport
require('./app_server/models/usuarioFacebook');
require('./app_server/models/db');

var indexRouter = require('./app_server/routes/index');
var apiRouter = require('./app_server/routes/api');
var authRouter = require('./app_server/routes/auth');

require('./passport')(passport);

// Configuración de Passport. Lo inicializamos
// y le indicamos que Passport maneje la Sesión
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.set('views', path.join(__dirname,'app_server','views'));
app.set('view engine', 'pug');

app.use(Session({
    secret: 'your-random-secret-19890913007',
    resave: true,
    saveUninitialized: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/recorridos',indexRouter);
app.use('/api',apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
