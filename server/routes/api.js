var express = require('express');
var placesRouter = require('./api/places');
var pathsRouter = require('./api/paths');

const router = express.Router();

router.use("/places", placesRouter);
router.use("/paths", pathsRouter);

module.exports = router;