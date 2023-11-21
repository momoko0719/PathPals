import React, { useState, useEffect } from "react";

export default function Discover({ searchTerm }) {
  const [paths, setPaths] = useState([]);
  const [filteredPaths, setFilteredPaths] = useState([]);

  useEffect(() => {
    fetchPaths(searchTerm);
  }, []);

  const fetchPaths = async () => {
    try {
      const response = await fetch("/api/paths"); // Fetch all paths
      const data = await response.json();
      setPaths(data);
    } catch (error) {
      console.error("Error fetching paths:", error);
    }
  };

  useEffect(() => {
    // Filter paths based on the search term
    const filtered = paths.filter((path) => {
      const pathNameMatch = path.path_name.toLowerCase().includes(searchTerm.toLowerCase());
      const placesMatch = path.places.some((place) => place.toLowerCase().includes(searchTerm.toLowerCase()));
      return pathNameMatch || placesMatch;
    });
    setFilteredPaths(filtered);
  }, [searchTerm, paths]);

  return (
    <div className="content-container">
      <div className="content-controllers">
        <Controllers />
      </div>
      <div className="content-cards row row-cols-3">
        {filteredPaths.map((path, index) => (
          <div className="col" key={index}>
            <PathCard path={path} />
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

function PathCard({ path }) {
  return (
    <div className="card">
      <img src="" className="card-img-top" alt="" />
      <div className="card-body">
        <h5 className="card-title">{path.path_name}</h5>
        <p className="card-text">
          {path.description}
        </p>
        <div className="place-list">
          <h6>Places:</h6>
          <ul>
            {path.places.map((place, index) => (
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
