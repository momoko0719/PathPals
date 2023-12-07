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

// get my profile
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

router.get('/myUsername', (req, res) => {
  if (req.session.account && req.session.account.username) {
    const username = req.session.account.username;
    console.log('Username grabbed:', username);
    res.json({ username });
  } else {
    res.status(401).json({ error: 'not logged in' });
  }
});

router.post('/updateBio', async (req, res) => {
  try {
    if (req.session.isAuthenticated) {
      const { bio } = req.body;
      const user = await models.User.findOne({ username: req.session.account.username });
      user.bio = bio;
      await user.save();
      res.send({ status: 'success' });
    } else {
      res.status(401).json({ error: 'not logged in' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "error", error: error.message });
  }
});

module.exports = router;