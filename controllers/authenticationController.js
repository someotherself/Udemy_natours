const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');
const { promisify } = require('util');
const sendEmail = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    photo: req.body.photo,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });
  // Getting a token from JWT and adding it to the response.
  const token = signToken(newUser._id);
  res.status(201).json({
    token,
    status: 'success',
    message: { user: newUser }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and passord', 400));
  }
  // 2) Check if the user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  // Checking the password by passing them into correctPassword function
  // password -> password input by the user
  // user.password -> correct pass in the DB
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3) If ok, send the token back to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Get if token exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged it!', 401));
  }
  // 2) Validate token.
  // jwt.verify is an async function. Promisify turns it into a promise
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError('Authentication failed. User does not exist. Please log in again.', 401));
  // 4) Check if user changed passwords after token was issued
  if (await currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Authentication error. Password changed. Please login again!', 401));
  }
  // Give access to protected route.
  req.user = currentUser;
  next();
});

exports.restrict = (...roles) => {
  return (req, res, next) => {
    // roles is an array (of the arguments passed in)
    if (!roles.includes(req.user.role)) return next(new AppError('You do not have permission for this action.', 403));
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  console.log('test');
  if (!req.body.email) return next(new AppError('Please enter your email address', 404));
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('There is no user with this email address.', 404));
  // 2) Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token (valid for 10 minutes).`,
      message
    });
    res.status(201).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
};
exports.resetPassword = (req, res, next) => {};
