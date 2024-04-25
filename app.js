const morgan = require('morgan');
const express = require('express');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const complaintRouter = require('./routes/complaintRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(helmet()); // Security headers

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 req from an IP per hour
  message: 'Too many requests from this IP, please try again in an hour.'
});

// Global Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '10kb' }));
// app.use(express.static(`${__dirname}/public`)); // Used for serving static files

// Sub-app specific middleware
app.use('/api', limiter);
app.use('/api/v1/complaints/', complaintRouter);
app.use('/api/v1/users/', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Canot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
