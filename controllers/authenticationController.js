const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');
const { promisify } = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const Cookies = require('cookie');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const cookieOptions = {
  expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
  // Cookie will only be sent over https
  httpOnly: true
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  user.password = undefined;

  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    token,
    status: 'success',
    message: { user }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    photo: req.body.photo,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    active: true
  });
  // Getting a token from JWT and adding it to the response.
  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Get if token exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers.cookie) {
    const cookies = Cookies.parse(req.headers.cookie);
    token = cookies.jwt || null;
  }

  if (!token) {
    return next(new AppError('You are not logged it!', 401));
  }
  // 2) Validate token.
  // jwt.verify is an async function. Promisify turns it into a promise
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError('Authentication failed. Please log in again.', 401));
  }
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

// Only for rendered pages, no errors.
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.headers.cookie) {
    const cookies = Cookies.parse(req.headers.cookie);
    const token = cookies.jwt || null;
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }
    if (await currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }
    // There is a logged in user
    // the pug template will have access to the res.locals
    res.locals.user = currentUser;
    return next();
  }
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
  if (!req.body.email) return next(new AppError('Please enter your email address', 404));
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('There is no user with this email address.', 404));
  // 2) Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to:\n${resetURL}.\nIf you didn't forget your password, ignore this email!`;

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
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
  // 2) if token has not expired, and there is a user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid, or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // Allowing the validators here will check if password and passwordConfim match
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // Done in the userModel

  // 4) Log the user in
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from the collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  // 3) If correct, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4) Log user in, sent JWT
  createSendToken(user, 200, res);
});
