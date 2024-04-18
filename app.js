const morgan = require('morgan');
const express = require('express');

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

// This catches any URLs that aren't specified in the routes.
// It's the last in the middleware chain, so it catches anything else.
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Canot find ${req.originalUrl} on this server`
  // });
  const err = new Error(`Canot find ${req.originalUrl} on this server`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.stats = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
