var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var auth = require('./app_server/routes/auth');
var mongoose = require('mongoose');

require('./app_server/models/db');

var indexRouter = require('./app_server/routes/index');
var apiRouter = require('./app_server/routes/api');
var usersRouter= require('./app_server/routes/users');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://user:user@ds014648.mlab.com:14648/recorridos', { useMongoClient: true })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));


var app = express();

app.set('views', path.join(__dirname,'app_server','views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/recorridos',indexRouter);
app.use('/api',apiRouter);
app.use('/auth', auth);
app.use('/users',usersRouter);

app.use(session({
  secret: 's3cr3t',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


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
