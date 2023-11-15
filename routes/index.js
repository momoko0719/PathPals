import express from 'express';
import executeSql from '../models/dbUtils.js';

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// example to use run a sql query from a router
router.get('/getalluser', async function (req, res) {
  try {
    var db = req.db;
    var query = 'SELECT * FROM tblUSER';
    var result = await executeSql(db, query);
    console.log(result);
    res.json({ status: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error executing query on database');
  }
});

export default router;