const express = require('express');
const models = require('../../models');
const session = require('express-session');

var router = express.Router();

router.get('/myIdentity', (req, res) => {
  if (!req.session.isAuthenticated) {
    res.json({ status: 'loggedout' });
  } else {
    const { name, username } = req.session.account;
    res.json({
      status: 'loggedin',
      userInfo: {
        name,
        username
      }
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { user } = req.query;
    const userInfo = await models.User.find({ username: user });
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

router.post('/', async (req, res) => {
  try {
    if (req.session.isAuthenticated) {
      const { name, username } = req.body;
      console.log(name, username);
      let exist = await models.User.findOne({ email: username });

      if (exist) {
        // user.bio = bio;
        // await user.save();
      } else {
        const newUser = new models.User({ username: name, email: username });
        await newUser.save();
      }
      res.send({ status: 'success' });
    } else {
      res.status(401).json({ error: 'not logged in' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "error", error: error.message });
  }
})


module.exports = router; 