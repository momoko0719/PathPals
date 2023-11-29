import React from "react";
import PathDetails from "./PathDetails";

function Detail({ path }) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <PathDetails path={path} />
          <div>
            <h5>Path Preview</h5>
          </div>
        </div>
        <div className="col-md-6">
          {/*User, Comment, Likes */}
          <div>
            <h5>User + Comment + Likes</h5>
            <p>Username: </p>
            <button className="btn btn-primary">
              <i className="far fa-thumbs-up"></i> Like
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
