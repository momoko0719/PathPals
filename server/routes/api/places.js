const express = require('express');
const { Client } = require('@googlemaps/google-maps-services-js');

const models = require('../../models');

const router = express.Router();

// create a new client to make the fetch call
const client = new Client({});

// given a text input of a place, return the information of that place
router.get('/', async (req, res) => {
  if (req.query.placeid) {
    try {
      // check if placeId exists in our mongodb
      // if exist, grab info
      // else, make fetch call to Google API
      let exist = await req.models.Place.find({ place_id: req.query.placeid });

      if (exist.length > 0) {
        console.log('exist');
        res.json(exist[0]);
      } else {
        console.log('not exist')
        // use placeId to make another request to get places details
        const params = {
          place_id: req.query.placeid,
          fields: ['formatted_address', 'name', 'photos'],
          key: process.env.REACT_APP_GOOGLE_API_KEY
        }

        const response = await client.placeDetails({ params: params });
        // save the place to mongodb with the placeId as the key
        await addNewPlace(response.data.result, req.query.placeid);
        res.json(response.data.result);
      }
    } catch (err) {
      res.json()
    }
  } else {
    res.json({ error: 'error in posting new path' });
  }
});

async function addNewPlace(place, placeid) {
  // dropthe html_attributions key from each photo object
  place.photos.forEach((photo) => {
    delete photo.html_attributions;
  });
  const newPlace = new models.Place({
    place_id: placeid,
    place_name: place.name,
    formatted_address: place.formatted_address,
    photos: place.photos
  });
  await newPlace.save();
}

module.exports = router;