import React from "react";
import PathDetails from "./PathDetails";

function Popup({ path }) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <PathDetails path={path} />
        </div>
        <div className="col-md-6">
          {/*User, Comment, Likes */}
          <div>
            <h5 onClick={() => showProfile(path.username)}>{path.username}</h5>
            <p>{path.formatted_date}</p>
            <button className="btn btn-primary">
              <i className="far fa-thumbs-up"></i> Like
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function showProfile(username) {
  try {
    let res = await fetch('/api/profile/' + username);
    await statusCheck(res);
    let profile = await res.json();
    console.log(profile);
    window.location.href = '/profile';
  } catch (err) {
    console.log(err);
  }
}
export default Popup;

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
