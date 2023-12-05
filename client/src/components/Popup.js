import React, { useState } from "react";
import PathDetails from "./PathDetails";

function Popup({ path, user, setLikes }) {
  const [newLike, updateLike] = useState(path.num_likes);

  const updateLikes = async () => {
    try {
      let response = await fetch("/api/paths/likes", {
        method: "POST",
        body: JSON.stringify({id: path._id, username: user.username}),
        headers: {
          "Content-Type": "application/json"
        }
      });
      await statusCheck(response);
      let data = await response.json();
      setLikes(path._id, data.like);
      updateLike(data.like);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <PathDetails path={path} />
        </div>
        <div className="col-md-6">
          <div>
            <p onClick={() => showProfile(path.username)}>{path.username}</p>
            <h1>{path.path_name}</h1>
            <h2>{path.description}</h2>
            <p>{path.formatted_date}</p>
            <hr></hr>
            <div>
              {/* comments */}
            </div>
            <span className="me-4"><i className="bi bi-hand-thumbs-up" onClick={updateLikes}></i> {newLike}</span>
            <i class="bi bi-pencil-square" onClick={() => {editPath(path)}}></i>
          </div>
        </div>
      </div>
    </div>
  );
}

function editPath(path) {
  let params = new URLSearchParams();
  params.append("name", path.path_name);
  params.append("description", path.description);
  params.append("places", path.places);
  window.location.href = `/create?${params.toString()}`;
}

async function showProfile(username) {
  try {
    // let res = await fetch('/api/profile/' + username);
    // await statusCheck(res);
    // let profile = await res.json();
    // console.log(profile);
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
