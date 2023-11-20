var express = require('express');
var placesRouter = require('./api/places');

const router = express.Router();

router.use("/places", placesRouter);

module.exports = router;