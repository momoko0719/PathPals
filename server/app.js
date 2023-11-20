var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var apiRouter = require('./routes/api');
var usersRouter = require('./routes/users');
var models = require('./models')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middlewares
app.use((req, res, next) => {
  req.models = models;
  next();
});

app.use('/api', apiRouter);
app.use('/users', usersRouter);

module.exports = app;
