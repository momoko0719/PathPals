import React, { useState } from "react";
import PathDetails from "./PathDetails";

function Popup({ path, user, setLikes }) {
  const [newLike, updateLike] = useState(path.num_likes);

  const updateLikes = async () => {
    try {
      let response = await fetch("/api/paths/likes", {
        method: "POST",
        body: JSON.stringify({ id: path._id, username: user.username }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      let data = await response.json();
      setLikes(path._id, data.like);
      updateLike(data.like);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const deletePath = async () => {
    try {
      let response = await fetch("/api/paths", {
        method: "DELETE",
        body: JSON.stringify({ pathId: path._id }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting path:", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <PathDetails path={path} />
        </div>
        <div className="col-md-6">
          <div>
            <h5 onClick={() => showProfile(path.username)}>{path.username}</h5>
            <p>{path.formatted_date}</p>
            <button className="btn btn-primary" onClick={updateLikes}>
              <i className="far fa-thumbs-up"></i> {newLike}
            </button>
          </div>
          {(user && path.username === user.username) && <button className="btn btn-danger" onClick={deletePath}>Delete</button>}
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
