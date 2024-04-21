const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();
  res.status(200).json({
    status: 'success',
    results: allUsers.length,
    data: {
      allUsers
    }
  });
});
