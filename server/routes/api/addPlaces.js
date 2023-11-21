const express = require('express');
const { Client } = require('@googlemaps/google-maps-services-js');

const router = express.Router();

// create a new client to make the fetch call
const client = new Client({});

// given a text input of a place, return the information of that place
router.post('/', async (req, res) => {
  try {
    console.log(req.body.id);
    if (req.body.id) {
      // use placeId to make another request to get places details
      const params = {
        place_id: id,
        fields: ['formatted_address', 'name', 'photos'],
        key: process.env.GOOGLE_MAPS_API_KEY
      }

      let response = await client.placeDetails({ params: params });

      res.json(response.data.result);
    } else {
      // res.type('text').send('Please input a place name');
      res.json({ status: 'Bad' })
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
