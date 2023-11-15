import 'dotenv/config';
import { Connection } from 'tedious';

var config = {
  server: process.env.DB_SERVER,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    }
  },
  options: {
    // If you are on Microsoft Azure, you need encryption:
    encrypt: true,
    database: process.env.DB_DATABASE
  }
};

var connection = new Connection(config);
connection.on('connect', function (err) {
  if (err) {
    console.log('Database connection failed: ' + err.message);
  } else {
    console.log("Connected to SQL Server");
  }
});

connection.connect();

export default connection;