import React from "react";

export default function PathCard({ path, onPathClick }) {
  return (
    <div className="card">
      <img src="" className="card-img-top" alt="" />
      <div className="card-body">
        <h5 className="card-title">{path.path_name}</h5>
        <p className="card-text">{path.description}</p>
        {/* hide this section for now, not fully implemented */}
        {/* <div className="place-list">
          <h6>Places:</h6>
          <ul>
            {path.places.map((place, index) => (
              <li key={index}>{place}</li>
            ))}
          </ul>
          <div>
            <p className="card-text">{path.likes.length} likes</p>
            <p className="card-text">{path.num_views} views</p>
            <p className="card-text">Date: {path.date_created}</p>
          </div>
        </div> */}
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-primary" onClick={() => onPathClick(path)}>
            View Path
          </button>
          <div>
            <span className="me-2 px-1">
              <i className="bi bi-hand-thumbs-up"></i> {path.likes.length}
            </span>
            <span>
              <i className="bi bi-eye"></i> {path.num_views}
            </span>
          </div>
        </div>
      </div>
    </div >
  );
}