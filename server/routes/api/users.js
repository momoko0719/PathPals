const express = require('express');
const models = require('../../models');
const session = require('express-session');

var router = express.Router();

router.get('/myIdentity', (req, res) => {
  console.log(req.session.isAuthenticated);
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
    const userInfo = await models.UserInfo.find({ username: user });
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

router.post('/', async (req, res) => {
  try {
    if (req.session.isAuthenticated) {
      const { username, bio } = req.body;
      let userInfo = await models.UserInfo.findOne({ username: username });

      if (userInfo) {
        userInfo.bio = bio;
        await userInfo.save();
      } else {
        const newUserInfo = new models.UserInfo({ username: username, bio: bio });
        await newUserInfo.save();
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