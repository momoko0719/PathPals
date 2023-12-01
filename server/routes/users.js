var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// store user info to mongo db
router.post('/', async (req, res) => {
  const { name, username } = req.body;
  try {
    let exist = await models.User.fin({ username: username });
    if (exist.length > 0) {
      console.log('user already exist');
      res.json({ status: 'success' });
      return;
    } else {
      let newUser = new models.User({ name, username });
      await newUser.save();
      res.json({ status: 'success' });
    }
    const saveInfo = { name, username };
  } catch (error) {
    console.error('error in saving user info', error);
    res.json({ error });
  }
});

module.exports = router;
