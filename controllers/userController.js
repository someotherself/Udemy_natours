const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObject[el] = obj[el];
    }
  });
  return newObject;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('Please use passwordUpdate route for updating password', 400)
    );
  }

  // 2) Update user and only the fields allowed
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateOne = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
