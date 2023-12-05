var express = require("express");
var models = require("../../models");
var router = express.Router();

// get all paths
router.get("/", async function (req, res, next) {
  const paths = await models.Path.find();
  let pathsData = await Promise.all(
    paths.map(async (path) => {
      try {
        return {
          id: path._id,
          username: path.username,
          path_name: path.path_name,
          description: path.description,
          places: path.places,
          date_created: path.date_created,
          formatted_date : formatDate(path.date_created),
          num_views: path.num_views,
          num_likes: path.num_likes,
          likes: path.likes, // an array of usernames that liked this path
          shared: path.shared,
        };
      } catch (error) {
        res.status(500).json({ status: "error", error: error });
      }
    })
  );
  res.json(pathsData);
});

// save a new path
router.post('/', async (req, res) => {
  try {
    let { path_name, description, places } = req.body;
    const newPath = new models.Path({
      username: 'Sam',
      path_name,
      description,
      places
    });
    await newPath.save();
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// updates the number of likes for a path
router.post('/likes', async (req, res) => {
  res.type('text');
  try{
    let {id, username} = req.body;
    if(id && username){
      let path = await models.Path.findById(id);
      if(path){
        let updateLike = path.num_likes + 1;
        let likeUsers = path.likes;
        likeUsers.push(username);
        let updated = await models.Path.findByIdAndUpdate(id,
          {likes : likeUsers, num_likes : updateLike}, {new: true});

        res.json({like: updated.num_likes});
      }else{
        res.status(400).json({ status: "error", error: "no path matches given id found" });
      }
    } else{
      res.status(400).json({ status: "error", error: "missing one or more body params" });
    }
  }catch(err){
    res.status(500).json({ status: "error", error: err.message });
  }
})

module.exports = router;

function formatDate(date){
  return ("0" + date.getHours()).slice(-2) + ":" +
        ("0" + date.getMinutes()).slice(-2) + " (" +
        ("0" + date.getDate()).slice(-2) + "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
        date.getFullYear() + ") ";
}