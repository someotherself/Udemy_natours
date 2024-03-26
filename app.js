const express = require('express');
const morgan = require('morgan');

const complaintRouter = require('./routes/complaintRoutes');

const app = express();

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
