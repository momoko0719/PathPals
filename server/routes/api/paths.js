var express = require("express");
var models = require("../../models");
var router = express.Router();

router.get("/", async function (req, res, next) {
  const paths = await models.Path.find();
  let pathsData = await Promise.all(
    paths.map(async (path) => {
      try {
        return {
          username: path.username,
          path_name: path.path_name,
          description: path.description,
          places: path.places,
          date_created: path.date_created,
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
});

module.exports = router;
