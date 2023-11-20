var express = require('express');
var models = require('../../models');
var router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const places = await models.Place.find();
  let placesData = await Promise.all(
    places.map(async place => {
      try {
        return {
          place_name: place.place_name
        }
      } catch (error) {
        res.status(500).json({ status: "error", error: error });
      }
    })
  );
  res.json(placesData);
});

module.exports = router;
