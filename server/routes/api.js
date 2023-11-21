var express = require('express');
var placesRouter = require('./api/places');
var pathsRouter = require('./api/paths');
const addPlacesRouter =  require('./api/addPlaces.js');

const router = express.Router();

router.use("/places", placesRouter);
router.use("/paths", pathsRouter);
router.use("/addPlaces", addPlacesRouter);


module.exports = router;