const express = require('express');
const { Client } = require('@googlemaps/google-maps-services-js');

const router = express.Router();

// create a new client to make the fetch call
const client = new Client({});

// given a text input of a place, return the information of that place
router.post('/', async (req, res) => {
  if (req.body.id) {
    try {
      // use placeId to make another request to get places details
      const params = {
        place_id: req.body.id,
        fields: ['formatted_address', 'name', 'photos'],
        key: process.env.REACT_APP_GOOGLE_API_KEY
      }

      let response = await client.placeDetails({ params: params });

      res.json(response.data.result);
    } catch (err) {
      console.log(err);
    }
  } else {
    // res.type('text').send('Please input a place name');
    res.json({ status: 'Bad' })
  }
});

module.exports = router;
