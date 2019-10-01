var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser =  require('body-parser');
var logger = require('morgan');
var config = require('./config.json');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
   extended: false 
  }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended:false
}));
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  let status = err.message == "Not Found" ? 404 : 500
  res.status(status);
  res.send({
      code: status,
      info: err.message
  })
});

app.listen(config.port);
