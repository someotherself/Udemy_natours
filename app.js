const morgan = require('morgan');
const express = require('express');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const complaintRouter = require('./routes/complaintRoutes');
const userRouter = require('./routes/userRoutes');

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
app.use('/api/v1/users/', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Canot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
