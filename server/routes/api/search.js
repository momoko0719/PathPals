var express = require("express");
var models = require("../../models");
var router = express.Router();

router.get("/", async function (req, res, next) {
  const searchTerm = req.query.term;
  try {
    const searchQuery = {
      $or: [
        { path_name: { $regex: searchTerm, $options: "i" } },
        { places: { $regex: searchTerm, $options: "i" } },
      ],
    };
    const paths = await models.Path.find(searchQuery);
    res.json(paths);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
