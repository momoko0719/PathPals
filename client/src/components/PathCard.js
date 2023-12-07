import React from "react";

export default function PathCard({ path, onPathClick }) {
  return (
    <div className="card">
      <img src="" className="card-img-top" alt="" />
      <div className="card-body">
        <h5 className="card-title">{path.path_name}</h5>
        <p className="card-text">{path.description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-primary" onClick={() => onPathClick(path)}>
            View Path
          </button>
          <div>
            <span className="me-2 px-1">
              <i className={"bi bi-hand-thumbs-up"}></i> {path.num_likes}
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