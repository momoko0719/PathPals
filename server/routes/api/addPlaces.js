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
      let exist = await req.models.Place.find({place_id: req.query.placeid});

      if(exist.length > 0){
        console.log(exist);
        res.json(exist);
      }else{
        // use placeId to make another request to get places details
        const params = {
          place_id: req.query.placeid,
          fields: ['formatted_address', 'name', 'photos'],
          key: process.env.REACT_APP_GOOGLE_API_KEY
        }

        let response = await client.placeDetails({ params: params });
        res.json(response.data.result);
      }
    } catch (err) {
      res.json()
    }
  } else {
    res.json({ error: 'error in posting new path' });
  }
});

router.post('/', async (req, res) => {
  try {
    let { path_name, description, places } = req.body;
    const newPath = new models.Path({
      username: 'Sam',
      path_name,
      description,
      places
    });
    await newPath.save();
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

module.exports = router;