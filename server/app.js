var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const cors = require('cors');
const si = require('http-errors');
require('dotenv').config();

var apiRouter = require('./routes/api');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var models = require('./models')
var oneDay = 1000 * 60 * 60 * 24;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set this to true on production
    maxAge: oneDay,
  }
}));

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // your frontend's address
  credentials: true, // to allow sending of cookies
}));

// middlewares
app.use((req, res, next) => {
  req.models = models;
  next();
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(
    `<html>
          <body>
              <h1 style='color: red'>Error!</h1>
              <h2>Message</h2>
              <p>${err.message}</p>
              <h4>Full Details</h4>
              <p>${JSON.stringify(err, null, 2)}</p>
          </body>
      </html>
      `
  );
});

module.exports = app;
