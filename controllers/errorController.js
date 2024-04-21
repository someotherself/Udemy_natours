const AppError = require('../utils/AppError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = () => {
  const value = err.message.match(/(?<={)(.*?)(?=})/g)[0];
  const message = `Duplicate field value: ${value}. Please use a new value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = () => {
  const errors = Object.values(err.errors).map(el => el.properties.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = err => new AppError('Invalid authentication. Please login again!', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Unknown errors
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Sorry!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') error = handleJWTError();
    sendErrorProd(error, res);
  }
};
