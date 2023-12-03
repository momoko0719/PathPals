var express = require('express');
var pathsRouter = require('./api/paths');
var placesRouter = require('./api/places.js');
var usersRouter = require('./api/users.js');

const router = express.Router();

router.use('/paths', pathsRouter);
router.use('/places', placesRouter);
router.use('/users', usersRouter);


module.exports = router;