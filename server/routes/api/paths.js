var express = require("express");
var models = require("../../models");
var router = express.Router();

// get all paths
router.get("/", async function (req, res, next) {
  try {
    const username = req.query.username;
    const liked = req.query.liked;
    let paths = null;
    if (username) {
      paths = await models.Path.find({ username: username });
    } else if (liked) {
      paths = await models.Path.find({ likes: liked });
    } else {
      paths = await models.Path.find();
    }
    let pathsData = await Promise.all(
      paths.map(async (path) => {
        try {
          return {
            _id: path._id,
            username: path.username,
            path_name: path.path_name,
            description: path.description,
            places: path.places,
            date_created: path.date_created,
            formatted_date: formatDate(path.date_created),
            num_views: path.num_views,
            likes: path.likes, // an array of usernames that liked this path
            shared: path.shared,
          };
        } catch (error) {
          res.status(500).json({ status: "error", error: error });
        }
      })
    );
    res.json(pathsData);
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// save a new path
router.post('/', async (req, res) => {
  try {
    if (req.session.isAuthenticated) {
      let username = req.session.account.username;
      let { path_name, description, places } = req.body;
      const newPath = new models.Path({
        username: username,
        path_name,
        description,
        places
      });
      await newPath.save();
      res.json({ status: 'success' });
    } else {
      res.status(401).json({ error: 'not logged in' });
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// update the likes of a path
router.post('/likes', async (req, res) => {
  try {
    if (req.session.isAuthenticated) {
      const { id, username } = req.body;
      if (id && username) {
        let path = await models.Path.findById(id);
        if (path) {
          let users = path.likes
          let like = path.num_likes;

          // if the user already liked that path, unlike it
          if (users.includes(username)) {
            users = users.filter((user) => {
              return user !== username;
            });
            like--;
          } else { // otherwise, likes the path
            users.push(username);
            like++;
          }
          let updateLike = await models.Path.findByIdAndUpdate(id, {
            num_likes: like,
            likes: users
          }, { new: true });
          res.json({ like: updateLike.num_likes });
        } else {
          res.status(400).json({ status: "error", error: 'no path matches given id' });
        }
      } else {
        res.status(400).json({ status: "error", error: 'missing one or more required params' });
      }
    } else {
      res.status(401).json({ error: 'not logged in' });
    }
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

module.exports = router;

function formatDate(date) {
  return ("0" + date.getHours()).slice(-2) + ":" +
    ("0" + date.getMinutes()).slice(-2) + " (" +
    ("0" + date.getDate()).slice(-2) + "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
    date.getFullYear() + ") ";
}