import React, { useState } from 'react';
import Autocomplete from "react-google-autocomplete";

export default function Create() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeDetail, setPlaceDetail] = useState(null);

  useEffect(async () => {
    if (selectedPlace && selectedPlace.place_id) {
      await fetchPlaceDetails(selectedPlace.place_id, setPlaceDetail);
    }
  }, [selectedPlace]);

  const handleSelected = (place) => {
    setSelectedPlace(place);
  };

  return(
    <div className='create-container row'>
      <div className='path-editor col'>
        <Autocomplete
          apiKey={process.env.GOOGLE_MAPS_API_KEY}
          style={{ width: "90%" }}
          onPlaceSelected={handleSelected}
          options={{
            types: ["(regions)"]
          }}
          placeholder="Search for a place"
        />
      </div>
      <div className='path-preview col'>
        Preview
        {placeDetail &&
          <div>
            <h2>{placeDetail.name}</h2>
            <p>Address: {placeDetail.formatted_address}</p>
            {placeDetail.photos[0]['html_attributions']}
          </div>
        }
      </div>
    </div>
  )
}

/**
 * get the place id from autocomplete and fetch place's details
 * @param {string} placeId - the id of a place on google
 * @param {Function} setPlaceDetail - a function to set the details for the props
 */
async function fetchPlaceDetails(placeId, setPlaceDetail){
  try {
    let res = await axios.post('/api/addPlaces', { placeId });
    await statusCheck(res);
    let details = await res.json();
    setPlaceDetail(details);
  } catch (err) {
    console.log(err);
  }
}

/**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
async function statusCheck(res) {
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res;
}
