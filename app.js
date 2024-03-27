const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');

const complaintRouter = require('./routes/complaintRoutes');

const app = express();

// const url = 'mongodb://localhost:27017/Test1';

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
// app.use(express.static(`${__dirname}/public`)); // Used for serving static files

app.use((req, res, next) => {
  req.reqestTime = new Date().toISOString();
  next();
});

// Sub-app specific middleware
app.use('/api/v1/complaints/', complaintRouter);

module.exports = app;
