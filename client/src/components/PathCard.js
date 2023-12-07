import React from "react";

export default function PathCard({ path, onPathClick, user }) {
  let username;
  if (user) {
    username = user.username;
  } else {
    username = null;
  }

  return (
    <div className="card">
      <div className="card-body d-flex flex-column justify-content-between">
        <h4 className="card-title">{path.path_name}</h4>
        <p className="card-text">{path.description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-primary" onClick={() => onPathClick(path)}>
            View Path
          </button>
          <div>
            <span className="me-2 px-1">
              <i className={username ? (path.likes.includes(username) ? "bi bi-hand-thumbs-up-fill" : "bi bi-hand-thumbs-up") : "bi bi-hand-thumbs-up"}></i> {path.num_likes}
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