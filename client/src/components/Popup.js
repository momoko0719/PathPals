import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PathDetails from "./PathDetails";

function Popup({ path, user, setLikes, fillForm }) {
  const [newLike, updateLike] = useState(path.num_likes);
  const [comments, setComments] = useState([]);
  const [numComments, updateNumComments] = useState(0);
  const [hasLiked, setHasLiked] = useState(path.likes.includes(user.username));
  const history = useNavigate()

  useEffect(() => {
    const fetching = async () => {
      await fetchComments();
    };

    fetching();
  }, [path]);

  const fetchComments = async () => {
    try {
      let res = await fetch(`/api/paths/comments/${path._id}`);
      res = await res.json();
      console.log(res);
      setComments(res);
      updateNumComments(res.length);
    } catch (err) {
      console.log(err);
    }
  }

  const updateLikes = async () => {
    try {
      let response = await fetch("/api/paths/likes", {
        method: "POST",
        body: JSON.stringify({ id: path._id, username: user.username }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      await statusCheck(response);
      let data = await response.json();
      console.log(data);
      setLikes(path._id, data.like, data.likes);
      updateLike(data.like);
      setHasLiked(data.likes.includes(user.username));
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

  const addComment = async (path, username, event) => {
    try {
      let response = await fetch(`/api/paths/comments/${path._id}`, {
        method: "POST",
        body: JSON.stringify({ username: username, comment: event.target.value }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      await statusCheck(response);
      let data = await response.json();
      if (comments.length === 0) {
        setComments([data]);
        updateNumComments(1);
      } else {
        setComments([...comments, data]);
        updateNumComments(numComments + 1);
      }
      event.target.value = "";
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="popup container">
      <div className="row">
        <div className="col-md-6 scrollable column">
          <PathDetails path={path} />
        </div>
        <div className="col-md-6 column">
          <div className="top-section">
            <h1>{path.path_name}</h1>
            <strong>{path.username}</strong>
            <p>{path.description}</p>
            <i>{path.formatted_date}</i>
            <hr style={{ marginBottom: '0' }}></hr>
          </div>
          <div className="comment-section" id="comments">
            <div className="scrollable">
              {comments.length === 0 && <p className="my-1 mx-1">No comments yet!</p>}
              {comments.length > 0 &&
                comments.map((comment) => {
                  return (
                    <div key={comment.id} className="my-1 mx-1">
                      <strong>{comment.username}</strong>
                      <p className="mb-0">{comment.comment}</p>
                      <p className="comment">{formatCommentDate(comment.date_created)}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="bottom-section">
            <input className="form-control" id='comment' type="text"
              onKeyDown={(e) => { if (e.key === "Enter") { addComment(path, user.username, e); } }} />
            <span className="me-4"><i className={hasLiked ? "bi bi-hand-thumbs-up-fill" : "bi bi-hand-thumbs-up"} onClick={updateLikes}></i> {newLike}</span>
            <span className="me-4"><i className="bi bi-chat"></i> {numComments}</span>
            {(user && path.username === user.username) && <span className="me-4"><i className="bi bi-pencil-square" onClick={() => { editPath(path, fillForm, history) }}></i></span>}
            {(user && path.username === user.username) && <span className="me-4"><i className="bi bi-trash" onClick={deletePath}></i></span>}
          </div>
        </div>
      </div>
    </div >
  );
}

function editPath(path, fillForm, history) {
  // send info over to create component
  let editPath = {
    path_name: path.path_name,
    description: path.description,
    places: path.places
  }
  fillForm(editPath);
  history("/create");
}

function formatCommentDate(date) {
  let onlyDate = date.split("T")[0];
  let splitDate = onlyDate.split("-");
  return splitDate[1] + "-" + splitDate[2];
}

function showProfile() {
  window.location.href = '/profile';
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
