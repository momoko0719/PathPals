import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PathDetails from "./PathDetails";
import { ErrorHandling, statusCheck } from "../utils";

function Popup({ path, user, setLikes, fillForm }) {
  const [newLike, updateLike] = useState(path.num_likes);
  const [comments, setComments] = useState([]);
  const [numComments, updateNumComments] = useState(0);
  const [hasLiked, setHasLiked] = useState(path.likes.includes(user.username));
  const [havePermission, updatePermission] = useState(path.shared);
  const history = useNavigate()

  useEffect(() => {
    const fetching = async() => {
      await fetchComments();
    };

    fetching();
  }, [path]);

  const fetchComments = async() => {
    try{
      let res = await fetch(`/api/paths/comments/${path._id}`);
      await statusCheck(res);
      res = await res.json();
      setComments(res);
      updateNumComments(res.length);
    }catch(err){
      console.log(err);
      ErrorHandling(err.message);
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
      setLikes(path._id, data.like, data.likes);
      updateLike(data.like);
      setHasLiked(data.likes.includes(user.username));
    } catch (error) {
      console.error("Error updating likes:", error);
      ErrorHandling(error.message);
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
      ErrorHandling("Error deleting path: " + error.message);
    }
  };

  const addComment = async (event) => {
    try {
      let response = await fetch(`/api/paths/comments/${path._id}`, {
        method: "POST",
        body: JSON.stringify({username: user.username, comment: event.target.value}),
        headers: {
          "Content-Type": "application/json"
        }
      });
      await statusCheck(response);
      let data = await response.json();
      if(comments.length === 0){
        setComments([data]);
        updateNumComments(1);
      }else{
        setComments([...comments, data]);
        updateNumComments(numComments + 1);
      }
      event.target.value = "";
    } catch (error) {
      console.error(error);
      ErrorHandling(error.message);
    }
  }

  const getAccess = async () => {
    try {
      let response = await fetch(`/api/paths/edit`, {
        method: "POST",
        body: JSON.stringify({pathId: path._id}),
        headers: {
          "Content-Type": "application/json"
        }
      });
      await statusCheck(response);
      let data = await response.json();
      updatePermission(data);
    } catch (error) {
      console.error(error);
      ErrorHandling(error.message);
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
            <p>{path.username}</p>
            <h1>{path.path_name}</h1>
            <h2>{path.description}</h2>
            <p>{path.formatted_date}</p>
            <hr></hr>
            <div id="comments">
              {comments.length > 0 &&
                comments.map((comment) => {
                  return(
                    <div key={comment.id} className="my-1 mx-1">
                      <strong>{comment.username}</strong>
                      <p className="mb-0">{comment.comment}</p>
                      <p className="comment">{formatCommentDate(comment.date_created)}</p>
                    </div>
                  )
                })
              }
            </div>
            <div>
              <input className="form-control" id='comment' type="text"
                     onKeyDown={(e) => {if(e.key === "Enter"){addComment(e);}}}/>
              <span className="me-4"><i className={hasLiked ? "bi bi-hand-thumbs-up-fill" : "bi bi-hand-thumbs-up"} onClick={updateLikes}></i> {newLike}</span>
              <span className="me-4"><i className="bi bi-chat"></i> {numComments}</span>
              {(user && user.username === path.username) && <i className="bi bi-pencil-square" onClick={() => {editPath(path, fillForm, history)}}></i>}
            </div>
          </div>
          {(user && (path.username === user.username || havePermission.includes(user.username)))
            && <button className="btn btn-danger my-2" onClick={deletePath}>Delete</button>}
          {(user && (user.username !== path.username && !havePermission.includes(user.username)))
            && <button className="btn btn-info my-2" onClick={getAccess}>Request Access</button>}
        </div>
      </div>
    </div>
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

function formatCommentDate(date){
  let onlyDate = date.split("T")[0];
  let splitDate = onlyDate.split("-");
  return splitDate[1] + "-" + splitDate[2];
}

function showProfile() {
  window.location.href = '/profile';
}
export default Popup;
