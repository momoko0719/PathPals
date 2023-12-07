import React, { useState, useEffect } from "react";
import { ErrorHandling, statusCheck } from "../utils";

export default function PathDetails({ path, onDelete }) {
  const [placesDetails, setPlacesDetails] = useState([]);

  useEffect(() => {
    const fetchAllPlaceDetails = async () => {
      const details = await Promise.all(path.places.map(place => fetchPlaceDetails(place)));
      setPlacesDetails(details);
    };

    fetchAllPlaceDetails();
  }, [path, onDelete]);

  const fetchPlaceDetails = async (placeId) => {
    try {
      let res = await fetch(`/api/places?placeid=${placeId}`);
      await statusCheck(res);
      let details = await res.json();
      console.log(details);
      return details;
    } catch (err) {
      console.log(err);
      ErrorHandling(err.message);
      return null;
    }
  }

  return (
    <div className="path-container">
      <div className='card-container'>
        {
          placesDetails.map((detail) => {
            return (
              <div className="card my-3" key={detail.formatted_address}>
                {detail.photos && <RenderCarousel photos={detail.photos} />}
                <div className="card-bodh px-2">
                  <h2>{detail.place_name}</h2>
                  <p>{detail.formatted_address}</p>
                </div>
                {window.location.href.includes('create') && <button className="btn btn-primary" onClick={() => onDelete(detail.place_id)}>Delete</button>}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

function RenderCarousel({ photos }) {
  const [currIndex, setCurrIndex] = useState(0);

  const nextSlide = () => {
    if (currIndex < photos.length - 1) {
      setCurrIndex(currIndex + 1);
    } else {
      setCurrIndex(0);
    }
  };

  const prevSlide = () => {
    if (currIndex > 0) {
      setCurrIndex(currIndex - 1);
    } else {
      setCurrIndex(photos.length - 1);
    }
  }

  return (
    <div id="carousel" className="carousel slide" data-ride="carousel">
      <div className="carousel-inner">
        {photos.map((photo, index) => (
          <div key={index} className={`carousel-item ${index === currIndex ? 'active' : ''}`}>
            <img src={'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' +
              photo['photo_reference'] + '&sensor=false&key=' +
              process.env.REACT_APP_GOOGLE_API_KEY}
              className="d-block rounded-top fixed-size-image" alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" onClick={prevSlide}>
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" onClick={nextSlide}>
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}