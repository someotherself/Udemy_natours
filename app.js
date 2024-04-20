const morgan = require('morgan');
const express = require('express');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

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

app.all('*', (req, res, next) => {
  // const err = new Error(`Canot find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new appError(`Canot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
