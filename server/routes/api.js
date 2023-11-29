var express = require('express');
var pathsRouter = require('./api/paths');
var placesRouter = require('./api/places.js');

const router = express.Router();

router.use("/paths", pathsRouter);
router.use("/places", placesRouter);


module.exports = router;