import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import 'dotenv/config.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import models from './models.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// db connection
app.use((req, res, next) => {
  req.models = models;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
