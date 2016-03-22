var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var user = require('./routes/user');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var settings = require('./config/database');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use('/api', expressJwt({ secret: settings.JWTPrivateKey }));
app.use('/api', function(req, res, next) {
	var authorization = req.header("authorization");
	var session = JSON.parse( new Buffer((authorization.split(' ')[1]).split('.')[1], 'base64').toString());
    res.locals.session = session;
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/restricted', function (req, res) {
	console.log('user ' + req.user.email + ' is calling /api/restricted');
	res.json({
		name: 'foo'
	});
});


app.use('/', routes);
app.use('/api', user);
require('./routes/register')(app);

//require('./routes/mail')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
