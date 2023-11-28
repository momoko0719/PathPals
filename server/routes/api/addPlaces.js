const express = require('express');
const { Client } = require('@googlemaps/google-maps-services-js');

const models = require('../../models');

const router = express.Router();

// create a new client to make the fetch call
const client = new Client({});

let API_COUNT = 0;

// given a text input of a place, return the information of that place
router.get('/', async (req, res) => {
  if (req.query.placeid) {
    try {
      // use placeId to make another request to get places details
      const params = {
        place_id: req.query.placeid,
        fields: ['formatted_address', 'name', 'photos'],
        key: process.env.REACT_APP_GOOGLE_API_KEY
      }

      let response = await client.placeDetails({ params: params });
      API_COUNT++;
      console.log(API_COUNT);
      res.json(response.data.result);
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
