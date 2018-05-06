var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('./app_server/models/db');

var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var bicisRouter = require('./app_server/routes/bicicletas');
var juvenilRouter = require('./app_server/routes/juvenil');
var midtownRouter = require('./app_server/routes/midtown');
var museosRouter = require('./app_server/routes/museos');
var apiRouter = require('./app_server/routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname,'app_server','views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/5aeefa56f36d2837eae68802', bicisRouter);
app.use('/5aeefa23f36d2837eae687ff', juvenilRouter);
app.use('/5aeefa6ef36d2837eae6880d', midtownRouter);
app.use('/5aeef9fef36d2837eae687fb', museosRouter);
app.use('/api',apiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
