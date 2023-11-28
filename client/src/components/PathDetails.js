import React, { useState, useEffect } from "react";

export default function PathDetails({ path }) {
  const [placesDetails, setPlacesDetails] = useState([]);

  useEffect(() => {
    if (path.places.length > 0) {

    }
  }, [path]);

  const fetchPlaceDetails = async (placeId) => {
    try {
      let res = await fetch(`/api/addPlaces?placeid=${placeId}`);
      let details = await res.json();
      return details;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  return (
    <div className="path-container">
      <h1>{path.path_name}</h1>
      <p>{path.description}</p>
      <div className='card-container'>
        {
          placesDetails.map((detail) => {
            return (
              <div className="card" key={detail.formatted_address}>
                <RenderCarousel photos={detail.photos} />
                <div className="card-bodh">
                  <h2>{detail.name}</h2>
                  <p>{detail.formatted_address}</p>
                </div>
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
              className="d-block w-100" alt={`Slide ${index}`} />
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