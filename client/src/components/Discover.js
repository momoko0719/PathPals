import React, { useState, useEffect } from "react";

export default function Discover({ searchTerm }) {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);

  useEffect(() => {
    fetchItineraries(searchTerm);
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await fetch("/api/paths"); // Fetch all itineraries
      const data = await response.json();
      setItineraries(data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  };

  useEffect(() => {
    // Filter itineraries based on the search term
    const filtered = itineraries.filter((itinerary) => {
      const pathNameMatch = itinerary.path_name.toLowerCase().includes(searchTerm.toLowerCase());
      const placesMatch = itinerary.places.some((place) => place.toLowerCase().includes(searchTerm.toLowerCase()));
      return pathNameMatch || placesMatch;
    });
    setFilteredItineraries(filtered);
  }, [searchTerm, itineraries]);

  return (
    <div className="content-container">
      <div className="content-controllers">
        <Controllers />
      </div>
      <div className="content-cards row row-cols-3">
        {filteredItineraries.map((itinerary, index) => (
          <div className="col" key={index}>
            <PathCard itinerary={itinerary} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Controllers() {
  return (
    <div className="row">
      <div className="col-2">Controller 1</div>
      <div className="col-2">Controller 2</div>
      <div className="col-2">Controller 3</div>
    </div>
  );
}

function PathCard({ itinerary }) {
  return (
    <div className="card">
      <img src="" className="card-img-top" alt="" />
      <div className="card-body">
        <h5 className="card-title">{itinerary.path_name}</h5>
        <p className="card-text">
          {itinerary.description}
        </p>
        <div className="place-list">
          <h6>Places:</h6>
          <ul>
            {itinerary.places.map((place, index) => (
              <li key={index}>{place}</li>
            ))}
          </ul>
        </div>
        <a href="#" className="btn btn-primary">
          View Path
        </a>
      </div>
    </div>
  );
}
